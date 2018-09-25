const fs = require('fs')

const TS = require('./lib/TS.js')
const Token = require('./lib/Token.js')
const Tag = require('./lib/Tag.js')

let EOF, lookhead

let code
let pointer = 0

let line = 1
let column = 1

let state
let tokenName
let error = false

const table = new TS()

const main = () => {

  const portugoloCode = fs.createReadStream('./primeiro_portugolo.ptgl')

  portugoloCode.on('data', item => {
    code = item.toString('utf8').split('')
    EOF = code.length

    let token
    
    do {
      state = 'S'
      tokenName = []
      error = false
      token = nextToken()
      if (token !== null) {
        const {name, lexeme, line, column} = token
        console.info(`\x1b[32m Token: <\x1b[33m${name}\x1b[32m, '\x1b[33m${lexeme}\x1b[32m'> Linha: \x1b[33m${line}\x1b[32m Coluna: \x1b[33m${column}\x1b[0m`)
      }
    } while(token !== null && pointer <= EOF)

  })

  portugoloCode.on('end', () => {
    // Imprimir tabela de símbolos
    console.log("Tabela de simbolos:")
    table.getTS()
  })

}

main()

const isDigit = char => Number.isInteger(parseInt(char))

const isLetter = char => char.match(/[a-zA-Z]/) && char.match(/[a-zA-Z]/).length > 0

const nextToken = () => {
  lookhead = pointer !== EOF ? code[pointer] : 'EOF'
  while(true) {
    lookhead = pointer !== EOF ? code[pointer] : 'EOF'
    pointer++
    console.log(lookhead.charCodeAt(0), lookhead)
    if (lookhead === '\n') {
      line++
      column = 1
      console.log('Aqui', line, column)
    } else if (lookhead === '\t') {
      column += 3
    } else {
      column++
    }
    switch (state) {
      case 'S':
        if (lookhead === 'EOF') {
          return new Token(Tag.getTagType(lookhead, false), lookhead, line, column)
        } else if (lookhead === ' ' || lookhead === '\t' || lookhead === '\n' || lookhead === '\r') {
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
          return new Token(Tag.getTagType(lookhead, false), lookhead, line, column - 1)
        } else if (isDigit(lookhead)) {
          pointer--
          column--
          state = 1
        } else if (isLetter(lookhead)) {
          tokenName.push(lookhead)
          state = 8
        } else if (lookhead === '"') {
          tokenName.push(lookhead)
          state = 5
        } else if (lookhead === '>') {
          tokenName.push(lookhead)
          state = 18
        } else if (lookhead === '/') {
          tokenName.push(lookhead)
          state = 27
        } else if (lookhead === '<') {
          tokenName.push(lookhead)
          state = 21
        } else {
          showError(`Caractere inválido ${lookhead} na linha ${line} e coluna ${column}`)
          return null;
       }
        break
      case 1:
        if (lookhead === '.') {
          tokenName.push(lookhead)
          state = 2
        } else if (isDigit(lookhead)) {
          tokenName.push(lookhead)
        } else {
          pointer--
          column--
          return new Token('NUMERICO', tokenName.join(''), line, column)
        }
        break
      case 2:
        if (isDigit(lookhead)) {
          tokenName.push(lookhead)
          state = 3
        } else {
          if (!error) showError(`Caractere inválido ${lookhead} na linha ${line} e coluna ${column}`)
          error = true
        }
      break
      case 3:
        if (isDigit(lookhead)) {
          tokenName.push(lookhead)
        }
        else {
          pointer--
          column--
          return new Token('NUMERICO', tokenName.join(''), line, column)
        }
      break
      case 5:
        if (lookhead === '"') {
          if (!error) showError(`String deve conter pelo menos um caractere. Erro na linha ${line} coluna ${column}`)
          error = true
        }
        else if (lookhead === '\n') {
          if (!error) showError(`Um literal deve ser fechado antes da quebra de linha. Erro na linha ${line} coluna ${column}`)
          error = true
        }
        else if (lookhead === 'EOF') {
          showError(`String deve ser fechada com " antes do fim de arquivo`)
          return null;
        }
        else {
          tokenName.push(lookhead)
          state = 6
        }
        break
        case 6:
        if (lookhead === '"') {
          tokenName.push(lookhead)
          return new Token('LITERAL', tokenName.join(''), line, column - tokenName.length)
        }
        else if (lookhead === '\n') {
          if (!error) showError(`Padrao para [ConstString] inválido na linha ${line} coluna ${column}`)
          error = true
        }
        else if (lookhead === 'EOF') {
          if (!error) showError(`String deve ser fechada com " antes do fim de arquivo`)
          return null;
        }
        else {
          tokenName.push(lookhead)
        }
      break
      case 8:
        if (isDigit(lookhead) || isLetter(lookhead)) {
          tokenName.push(lookhead)
        }
        else {
          const completeTokenName = tokenName.join('')
          pointer--
          if (!table.containsToken(completeTokenName)) {
            const token = new Token('ID', completeTokenName, line, column - tokenName.length)
            table.addToken(token)
            column--
            return token
          } else {
            console.log('O problema de retorno está aqui', line, column)
            return table.updateToken(completeTokenName, line, column - tokenName.length)
          }
        }
      break
      case 18:
        if (lookhead === '=') {
          tokenName.push(lookhead)
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        }
        else {
          pointer--
          column--
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        }
      case 21:
        if (lookhead === '=') {
          tokenName.push(lookhead)
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        } else if (lookhead === '>') {
          tokenName.push(lookhead)
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        } else if (lookhead === '-') {
          tokenName.push(lookhead)
          state = 25
        } else {
          pointer--
          column--
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        }
      break
      case 25:
        if (lookhead === '-') {
          tokenName.push(lookhead)
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        } else {
          if (!error) showError(`Caractere inválido ${lookhead} na linha ${line} e coluna ${column}`)
          error = true
        }
      break
      case 27:
        if (lookhead === '/') {
          state = 29
        } else if (lookhead === '*') {
          state = 30
        } else {
          return new Token(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        }
      break
      case 29:
        if (lookhead === '\n' || lookhead === 'EOF') {
          state = 'S'
        }
      break
      case 30:
        if (lookhead === 'EOF') {
          if (!error) showError(`Comentário não fechado antes do fim do arquivo${line} e coluna ${column}`)
          error = true
        } else if (lookhead === '*') {
          state = 31
        }
      break
      case 31: 
        if (lookhead === '/') {
          state = 'S'
        } else {
          state = 30
        }
      break
    }
  }
}

const showError = mensagem => {
  console.error('\x1b[31m', `[Erro Lexico]: ${mensagem}`, '\x1b[0m')
}