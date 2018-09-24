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

// Dúvidas:
// Modo pânico? Mostrar o erro uma única vez e continuar até encontrar o esperado.
// Para literais: Eu retorno o erro e depois continuo a formar a string ou é um estado final? Divide em dois ids em caso de achar caracter inválido no meio.
// Para double, caso encontre outro ele deve retornar erro também no grafo? Ok
// Espaços são exigidos para operadores? Tanto faz
// Como colocar no grafo os operadores que são KW?
// Devo cadastrar operadores e na TS? "todas as palavras reservadas da linguagem", isso quer dizer todos estados finais?
// Para ids não tem modo panico?
