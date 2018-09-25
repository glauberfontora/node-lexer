const Token = require('./Token.js')
const Tag = require('./Tag.js')

const KEYWORDS = [
  "algoritmo",
  "declare",
  "fim",
  "subrotina",
  "retorne",
  "logico",
  "numerico",
  "literal",
  "nulo",
  "se",
  "inicio",
  "senao",
  "enquanto",
  "faca",
  "para",
  "ate",
  "repita",
  "escreva",
  "leia",
  "verdadeiro",
  "falso",
  "ou",
  "e",
  "nao"
]

class TS {
  constructor () {
    this.TS = []
    
    KEYWORDS.map(
      item => (
        this.TS.push(
          new Token(Tag.getTagType(item, true), item, 0, 0)
        )
      )
    )
  }

  getTS() {
    this.TS.map(item => {
      const {name, lexeme, line, column} = item
      return (
        console.info(`\x1b[32m Token: <\x1b[33m${name}\x1b[32m, '\x1b[33m${lexeme}\x1b[32m'> Linha: \x1b[33m${line}\x1b[32m Coluna: \x1b[33m${column}\x1b[0m`)
      )
    })
  }

  containsToken(search) {
    for (let index = 0; index < this.TS.length; index++) {
      const { lexeme } = this.TS[index]
      if (lexeme === search) {
        return true
      }
    }
    return false
  }

  updateToken(lexeme, line, column) {
    for (let index = 0; index < this.TS.length; index++) {
      if (this.TS[index].lexeme === lexeme) {
        this.TS[index].setLine(line)
        this.TS[index].setColumn(column)
      }
    }
  }

  getToken(search) {
    for (let index = 0; index < this.TS.length; index++) {
      const { lexeme } = this.TS[index]
      if (search === lexeme) {
        return this.TS[index]
      }
    }
  }

  addToken(item) {
    this.TS.push(
      item
    )
  }
}

module.exports = TS