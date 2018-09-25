class Token {
  constructor (name, lexeme, line, column) {
    this.name = name
    this.lexeme = lexeme
    this.line = line
    this.column = column
  }
  getToken() {
    return this
  }
  setLine(newLine) {
    this.line = newLine
  }
  setColumn(newColumn) {
    this.column = newColumn
  }
}

module.exports = Token