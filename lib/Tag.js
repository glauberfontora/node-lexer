// Cria um mapa de tags possíveis para não ter que retornar literal todas vezes
const getTagType = (tag, isKeyword) => {
  if (!isKeyword) {
    switch (tag) {
      case ';':
        return 'SMB_SEMICOLON'
      case 'EOF':
        return 'EOF'
      case '(':
        return 'SMB_OP'
      case ')':
        return 'SMB_CP'
      case ',':
        return 'SMB_COMMA'
      case '=':
        return 'RELOP_EQ'
      case '/':
        return 'RELOP_DIV'
      case '*':
        return 'RELOP_MULT'
      case '-':
        return 'RELOP_MINUS'
      case '+':
        return 'RELOP_SUM'
      case '>':
        return 'RELOP_GT'
      case '>=':
        return 'RELOP_GE'
      case '<':
        return 'RELOP_LT'
      case '<=':
        return 'RELOP_LE'
      case '<>':
        return 'RELOP_NE'
      case '<--':
        return 'RELOP_ASSIGN'
    }
  } else {
    return 'KW'
  }
}

module.exports.getTagType = getTagType
