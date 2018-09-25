// Classe construtora de um token
class Token {
  constructor (name, lexeme, line, column) {
    this.name = name
    this.lexeme = lexeme
    this.line = line
    this.column = column
  }

  // Retorna o token que está cadastrado
  getToken() {
    return this
  }
}

module.exports = Token