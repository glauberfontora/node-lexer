// Importa o arquivo de token para construção
const Token = require('./Token.js')
// Importa mapa de tags para construção
const Tag = require('./Tag.js')

// Mapa de todas as KW
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

// Classe construtora para tabela de símbolos
class TS {
  constructor () {
    // Inicia o construtor com uma tabela vazia
    this.TS = []
    
    // Manda toda a galera de KW para a tabela de simbolos
    KEYWORDS.map(
      item => (
        this.TS.push(
          new Token(Tag.getTagType(item, true), item, 0, 0)
        )
      )
    )
  }

  // Retorna a tabela de simbolos impressa
  getTS() {
    this.TS.map(item => {
      const {name, lexeme, line, column} = item
      return (
        console.info(`\x1b[32m Token: <\x1b[33m${name}\x1b[32m, '\x1b[33m${lexeme}\x1b[32m'> Linha: \x1b[33m${line}\x1b[32m Coluna: \x1b[33m${column}\x1b[0m`)
      )
    })
  }

  // Procura dentro da tabela se já tem um token
  containsToken(search) {
    for (let index = 0; index < this.TS.length; index++) {
      const { lexeme } = this.TS[index]
      if (lexeme === search) {
        return true
      }
    }
    return false
  }

  // Atualiza o token caso já exista na tabela
  updateToken(search, newLine, newColumn) {
    for (let index = 0; index < this.TS.length; index++) {
      const { lexeme } = this.TS[index]
      if (lexeme === search) {
        this.TS[index].line = newLine
        this.TS[index].column = newColumn
        return this.TS[index]
      }
    }
  }

  // Retorna um token procurado
  getToken(search) {
    for (let index = 0; index < this.TS.length; index++) {
      const { lexeme } = this.TS[index]
      if (search === lexeme) {
        return this.TS[index]
      }
    }
  }

  // Adiciona token na tabela
  addToken(item) {
    this.TS.push(
      item
    )
  }
}

module.exports = TS