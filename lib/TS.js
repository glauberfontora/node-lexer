const Token = require('./Token.js')
const Tag = require('./Tag.js')
const TS = []

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

KEYWORDS.map(item => (
    TS.push(
      Token.newToken(Tag.getTagType(item, true), item, 0, 0)
    )
  )
)

const getTS = () => {
  TS.map(item => {
    const {name, lexeme} = item
    return (
      console.log(`<${name}, ${lexeme}>`)
    )
  })
}
  
const addSymbol = (item, line, column) => {
  TS.push(
    Token.newToken(Tag.getTagType(item, true), item, line, column)
  )
}

module.exports.getTS = getTS
module.exports.addSymbol = addSymbol