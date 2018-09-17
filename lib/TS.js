const Token = require('./Token.js')
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

let keyword
KEYWORDS.map(item => {
  return (
    TS.push(
      Token.newToken('KW', item, 0, 0)
    )
  )
})

console.info(TS)

// export default TS