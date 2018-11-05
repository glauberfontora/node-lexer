// Importa o node_module de arquivos
const fs = require('fs')

//Importa as dependências do projeto
const TS = require('./lib/TS.js')
const Token = require('./lib/Token.js')
const Tag = require('./lib/Tag.js')

// Cria variáveis
let EOF, lookhead

let code
let pointer = 0

let line = 1
let column = 1

let state
let tokenName
let error = false

// Instancia uma nova tabela de simbolos
const table = new TS()

// Construção da função lexer que será invocada no inicio do arquivo
const lexer = () => {

  //Instancia o código a partir de um arquivo
  const portugoloCode = fs.createReadStream('./primeiro_portugolo.ptgl')

  //Quando estiver pronto para leitura
  portugoloCode.on('data', item => {

    // Transforma o código lido em um array para leitura mais rápida
    code = item.toString('utf8').split('')

    //Define o fim do arquivo baseado no tamanho do array de caracteres
    EOF = code.length

    //Define o que é um token
    let token
    
    // Loop enquanto não chegar no fim do arquivo ou receber um token desconhecido
    do {
      // Define que sempre irá começar pelo estado S
      state = 'S'

      //Inicia uma nova string
      tokenName = []

      // Volta a variável de erro para o estado inicial para exibir erros lexicos uma única vez
      error = false

      //Chama a função de próximo token
      token = nextToken()

      //Pega o retorno do token informado e exibe no console
      if (token !== null) {
        const {name, lexeme, line, column} = token
        console.info(`\x1b[32m Token: <\x1b[33m${name}\x1b[32m, '\x1b[33m${lexeme}\x1b[32m'> Linha: \x1b[33m${line}\x1b[32m Coluna: \x1b[33m${column}\x1b[0m`)
      }
    } while(token !== null && pointer <= EOF)

  })

  // Imprimir tabela de símbolos após o fim da leitura do arquivo
  portugoloCode.on('end', () => {
    console.log("Tabela de simbolos:")
    table.getTS()
  })
}

//Invoca a função lexer para começar a leitura
lexer()

// Função para verificar se é um dígito
const isDigit = char => Number.isInteger(parseInt(char))

// Função para verificar ser é uma letra
const isLetter = char => char.match(/[a-zA-Z]/) && char.match(/[a-zA-Z]/).length > 0

//Função para ler o próximo token chamado pela função lexer.
const nextToken = () => {
  //Pega o caractere que está disponível para ser lido
  lookhead = pointer !== EOF ? code[pointer] : 'EOF'

  //Inicia o loop que vai ler caractere a caractere
  while(true) {
    lookhead = pointer !== EOF ? code[pointer] : 'EOF'
    pointer++
    switch (state) {
      case 'S':
        if (lookhead === 'EOF') {
          //Retorna token de fim de arquivo
          return new Token(Tag.getTagType(lookhead, false), lookhead, line, column)
        } else if (lookhead === ' ' || lookhead === '\t' || lookhead === '\n') {
          //Caso encontre espaço vazio, tabulação ou quebra de linha ele ignora e permanece no estado S
          state = 'S'
        } else if (
          lookhead === ';'
          || lookhead === '('
          || lookhead === ')'
          || lookhead === ','
          || lookhead === '='
          || lookhead === '*'
          || lookhead === '-'
          || lookhead === '+'
        ) {
          // Incrementa linha em caso de retorno direto de token de um único caractere
          column++
          // Retorna o token de um único caractere
          return new Token(Tag.getTagType(lookhead, false), lookhead, line, column - 1)
        } else if (isDigit(lookhead)) {
          // Encontrou um token numérico
          pointer--
          column--
          state = 1
        } else if (isLetter(lookhead)) {
          // Encontrou um token ID ou KW
          tokenName.push(lookhead)
          state = 8
        } else if (lookhead === '"') {
          // Encontrou um token literal
          tokenName.push(lookhead)
          state = 5
        } else if (lookhead === '>') {
          // Encontrou um token iniciado com >
          tokenName.push(lookhead)
          state = 18
        } else if (lookhead === '/') {
          // Encontrou um token iniciado com /
          state = 27
        } else if (lookhead === '<') {
          // Encontrou um token iniciado com <
          tokenName.push(lookhead)
          state = 21
        } else {
          // Encontrou algo que não esperava em primeira instancia
          showError(`Caractere inválido ${lookhead} na linha ${line} e coluna ${column}`)
          return null;
       }
        break
      case 1:
        //Trata token numérico
        if (lookhead === '.') {
          //Envia para tratamento de token FLOAT
          tokenName.push(lookhead)
          state = 2
        } else if (isDigit(lookhead)) {
          //Trata token INTEGER
          tokenName.push(lookhead)
        } else {
          // Retorna um token do tipo numérico
          pointer--
          column--
          return new Token('NUMERICO', tokenName.join(''), line, column)
        }
        break
      case 2:
        // Trata token FLOAT
        if (isDigit(lookhead)) {
          tokenName.push(lookhead)
          //Encontra pelo menos um número após o ponto flutuante e pergunta se tem mais
          state = 3
        } else {
          //Entra em módo pânico para número float fora de padrão
          if (!error) showError(`Caractere inválido ${lookhead} na linha ${line} e coluna ${column}`)
          error = true
        }
      break
      case 3:
        //Caso tenha mais números ele incrementa
        if (isDigit(lookhead)) {
          tokenName.push(lookhead)
        } else {
          pointer--
          column--
          // Se ele não achar mais números ele vai retornar o token numérico do tipo FLOAT
          return new Token('NUMERICO', tokenName.join(''), line, column)
        }
      break
      case 5:
        // Trata token literal
        if (lookhead === '"') {
          // Entra em modo pânico para tratamento de string vazia
          if (!error) showError(`String deve conter pelo menos um caractere. Erro na linha ${line} coluna ${column}`)
          error = true
        }
        else if (lookhead === '\n') {
          // Entra em modo pânico para tratamento de string não fechada antes do fim de linha
          if (!error) showError(`Um literal deve ser fechado antes da quebra de linha. Erro na linha ${line} coluna ${column}`)
          error = true
        }
        else if (lookhead === 'EOF') {
          // Exibe erro quando a string não for fechada antes do fim do arquivo e retorna um token inválido
          showError(`String deve ser fechada com " antes do fim de arquivo`)
          return null;
        }
        else {
          // Se não achou problema pra ser tratado ele segue a montagem do LITERAL
          tokenName.push(lookhead)
          state = 6
        }
        break
        case 6:
        // Continua montando o LITERAL
        if (lookhead === '"') {
          tokenName.push(lookhead)
          return new Token('LITERAL', tokenName.join(''), line, column - tokenName.length)
        }
        else if (lookhead === '\n') {
          // Entra em modo pânico para tratamento de string não fechada antes do fim de linha
          if (!error) showError(`Um literal deve ser fechado antes da quebra de linha. Erro na linha ${line} coluna ${column}`)
          error = true
        }
        else if (lookhead === 'EOF') {
          // Exibe erro quando a string não for fechada antes do fim do arquivo e retorna um token inválido
          if (!error) showError(`String deve ser fechada com " antes do fim de arquivo`)
          return null;
        }
        else {
          // Se não achou problema pra ser tratado ele retorna o LITERAL
          tokenName.push(lookhead)
        }
      break
      case 8:
        //Trata ID ou KW
        if (isDigit(lookhead) || isLetter(lookhead)) {
          //Monta o ID ou KW
          tokenName.push(lookhead)
        }
        else {
          const completeTokenName = tokenName.join('')
          pointer--
          // Irá retornar o token ID ou KW encontrado, validando se já existe na tabela de simbolos e irá gravar nela somente se não existir
          if (!table.containsToken(completeTokenName)) {
            const token = new Token('ID', completeTokenName, line, column - tokenName.length)
            table.addToken(token)
            column--
            //Retorna para exibir no console após gravar na TS
            return token
          } else {
            //Atualiza a linha encontrada e retorna para exibição sem gravar na TS
            return table.updateToken(completeTokenName, line, column - tokenName.length)
          }
        }
      break
      case 18:
        // Trata simbolo de maior ou maior/igual
        if (lookhead === '=') {
          tokenName.push(lookhead)
          //Retorna maior/igual
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        }
        else {
          pointer--
          column--
          // Retorna maior
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        }
      case 21:
        //Trata simbolos menor/igual, diferente ou atribuição
        if (lookhead === '=') {
          tokenName.push(lookhead)
          // Retorna menor/igual
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        } else if (lookhead === '>') {
          tokenName.push(lookhead)
          // Retorna diferente
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        } else if (lookhead === '-') {
          tokenName.push(lookhead)
          // Identificou que é uma atribuição
          state = 25
        } else {
          pointer--
          column--
          // Retorna menor
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        }
      break
      case 25:
        // Trata atribuição
        if (lookhead === '-') {
          tokenName.push(lookhead)
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        } else {
          // Entra em modo pânico em caso de achar algo entre os dois -- que deve ser de atribuição
          if (!error) showError(`Caractere inválido ${lookhead} na linha ${line} e coluna ${column}`)
          error = true
        }
      break
      case 27:
        // Inicia tratamento de comentários ou simbolo de divisão
        if (lookhead === '/') {
          // Encontra comentário de uma linha
          state = 29
        } else if (lookhead === '*') {
          // Encontra comentário de mais de uma linha
          state = 30
        } else {
          // Retorna divisor
          tokenName.push(lookhead)
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        }
      break
      case 29:
        if (lookhead === '\n' || lookhead === 'EOF') {
          // Ignora toda a informação do comentário de uma linha
          state = 'S'
        }
      break
      case 30:
        if (lookhead === 'EOF') {
          // Em comentário de mais de uma linha exibe o erro sobre não ter sido fechado antes de fechar o arquivo
          if (!error) showError(`Comentário não fechado antes do fim do arquivo${line} e coluna ${column}`)
          error = true
        } else if (lookhead === '*') {
          // Encontra algo que pode indicar o fim do comentário
          state = 31
        }
      break
      case 31: 
        if (lookhead === '/') {
          // Realmente era o fim de um comentário, o que ele vai fazer? Ignorar também os comentários de mais de uma linha
          state = 'S'
        } else {
          // Era alarme falso, ele tem que voltar pra tentar achar o fim do comentário de mais de uma linha
          state = 30
        }
      break
    }
    //Implementa contador de linhas e colunas
    if (lookhead === '\n') {
      line++
      column = 1
    } else if (lookhead === '\t') {
      column += 3
    } else {
      column++
    }
  }
}
//Função para retornar as mensagens de erro. O código começado em \x1b[ é para mudar a cor e ficar mais intuitivo no console.
const showError = mensagem => {
  console.error('\x1b[31m', `[Erro Lexico]: ${mensagem}`, '\x1b[0m')
}