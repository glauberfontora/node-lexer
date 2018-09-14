const Token = (name, lexeme, row, column) => {
  const tokenObj = {
    name: tokenId[name].test(lexeme) ? name : null,
    lexeme: lexeme,
    row: row,
    column: column
  }
  return tokenObj
}

/** 
*  @param DT - Dígito
*  @param LT - Letra
*  @param NB - Numérico
*  @param ID - Identificador
*  @param ST - Literal
*  @param KW - Palavra reservada
*/

const tokenId = {
  DT: /[0-9]/,
  LT: /[a-zA-Z]/,
  NB: /[0-9]+(\.[0-9]+)?/,
  ID: /[a-zA-Z]([a-zA-Z]|[0-9])*/,
  ST: /\".*\"/,
  KW: /\".*\"/
}

export default Token
