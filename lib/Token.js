module.exports.newToken = function (name, lexeme, row, column) {
  const tokenObj = {
    name: name,
    lexeme: lexeme,
    row: row,
    column: column
  }
  return tokenObj
}
