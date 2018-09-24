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

const main = () => {
  const portugoloCode = fs.createReadStream('./primeiro_portugolo.ptgl')

  portugoloCode.on('data', item => {
    code = item.toString('utf8').split('')
    EOF = code.length

    let token
    
    do {
      state = 'S'
      tokenName = []
      token = nextToken()
      console.log(token)
    } while(token !== null && pointer <= EOF)

  })

  portugoloCode.on('end', () => {
    console.log('Leitura completa')
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
    column++
    if (lookhead === '\n') {
      line++
      column = 0
    }
    if (lookhead === '\n') {
      column += 3
    }
    switch (state) {
      case 'S':
        if (lookhead === 'EOF') {
          return Token.newToken(Tag.getTagType(lookhead, false), lookhead, line, column)
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
          return Token.newToken(Tag.getTagType(lookhead, false), lookhead, line, column)
        } else if (isDigit(lookhead)) {
          pointer--
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
          showError(`Caractere invalido ${lookhead} na linha ${line} e coluna ${column}`)
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
          return Token.newToken('NUMERICO', tokenName.join(''), line, column)
        }
        break
      case 2:
        if (isDigit(lookhead)) {
          tokenName.push(lookhead)
          state = 3
        } else {
          showError(`Caractere invalido ${lookhead} na linha ${line} e coluna ${column}`)
        }
      break
      case 3:
        if (isDigit(lookhead)) {
          tokenName.push(lookhead)
        }
        else {
          pointer--
          return Token.newToken('NUMERICO', tokenName.join(''), line, column)
        }
      break
      case 5:
        if (lookhead === '"') {
          showError(`String deve conter pelo menos um caractere. Erro na linha ${line} coluna ${column}`)
          return null;
        }
        else if (lookhead === '\n') {
          showError(`Padrao para [ConstString] invalido na linha ${line} coluna ${column}`)
          return null;
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
          return Token.newToken('LITERAL', tokenName.join(''), line, column - tokenName.length)
        }
        else if (lookhead === '\n') {
          showError(`Padrao para [ConstString] invalido na linha ${line} coluna ${column}`)
          return null;
        }
        else if (lookhead === 'EOF') {
          showError(`String deve ser fechada com " antes do fim de arquivo`)
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
          pointer--
          return Token.newToken('ID', tokenName.join(''), line, column - tokenName.length)
        }
      break
      case 18:
        if (lookhead === '=') {
          tokenName.push(lookhead)
          return Token.newToken(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        }
        else {
          pointer--
          return Token.newToken(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        }
      case 21:
        if (lookhead === '=') {
          tokenName.push(lookhead)
          return Token.newToken(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        } else if (lookhead === '>') {
          tokenName.push(lookhead)
          return Token.newToken(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        } else if (lookhead === '-') {
          tokenName.push(lookhead)
          state = 25
        } else {
          pointer--
          return Token.newToken(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        }
      break
      case 25:
        if (lookhead === '-') {
          tokenName.push(lookhead)
          return Token.newToken(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        } else {
          showError(`Caractere invalido ${lookhead} na linha ${line} e coluna ${column}`)
        }
      break
      case 27:
        if (lookhead === '/') {
          state = 29
        } else if (lookhead === '*') {
          state = 30
        } else {
          return Token.newToken(Tag.getTagType(tokenName.join(''), false), tokenName.join(''), line, column)
        }
      break
      case 29:
        if (lookhead === '\n' || lookhead === 'EOF') {
          state = 'S'
        }
      break
      case 30:
        if (lookhead === 'EOF') {
          showError(`Comentário não fechado antes do fim do arquivo${line} e coluna ${column}`)
        } else if (lookhead === '*') {
          state = 32
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
  console.log(`[Erro Lexico]: ${mensagem}`)
}

// Imprimir tabela de símbolos
// console.log("Tabela de simbolos:")
// TS.getTS()
