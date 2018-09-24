module.exports.newToken = function (name, lexeme, line, column) {
  const tokenObj = {
    name: name,
    lexeme: lexeme,
    line: line,
    column: column
  }
  return tokenObj
}
