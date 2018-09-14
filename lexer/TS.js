const Token = require('./Token.js')
const TS = []
let KW

KW = Token('KW', "algoritmo", 0, 0)
TS.push(KW)

KW = Token('KW', "declare", 0, 0)
TS.push(KW)

KW = Token('KW', "fim", 0, 0)
TS.push(KW)

KW = Token('KW', ";", 0, 0)
TS.push(KW)

KW = Token('KW', "subrotina", 0, 0)
TS.push(KW)

KW = Token('KW', "(", 0, 0)
TS.push(KW)

KW = Token('KW', ")", 0, 0)
TS.push(KW)

KW = Token('KW', ",", 0, 0)
TS.push(KW)

KW = Token('KW', "retorne", 0, 0)
TS.push(KW)

KW = Token('KW', "logico", 0, 0)
TS.push(KW)

KW = Token('KW', "numerico", 0, 0)
TS.push(KW)

KW = Token('KW', "literal", 0, 0)
TS.push(KW)

KW = Token('KW', "nulo", 0, 0)
TS.push(KW)

KW = Token('KW', "se", 0, 0)
TS.push(KW)

KW = Token('KW', "inicio", 0, 0)
TS.push(KW)

KW = Token('KW', "senao", 0, 0)
TS.push(KW)

KW = Token('KW', "enquanto", 0, 0)
TS.push(KW)

KW = Token('KW', "faca", 0, 0)
TS.push(KW)

KW = Token('KW', "para", 0, 0)
TS.push(KW)

KW = Token('KW', "ate", 0, 0)
TS.push(KW)

KW = Token('KW', "repita", 0, 0)
TS.push(KW)

KW = Token('KW', "<--", 0, 0)
TS.push(KW)

KW = Token('KW', "escreva", 0, 0)
TS.push(KW)

KW = Token('KW', "leia", 0, 0)
TS.push(KW)

KW = Token('KW', "verdadeiro", 0, 0)
TS.push(KW)

KW = Token('KW', "falso", 0, 0)
TS.push(KW)

KW = Token('KW', "Ou", 0, 0)
TS.push(KW)

KW = Token('KW', "E", 0, 0)
TS.push(KW)

KW = Token('KW', "<", 0, 0)
TS.push(KW)

KW = Token('KW', "<=", 0, 0)
TS.push(KW)

KW = Token('KW', ">", 0, 0)
TS.push(KW)

KW = Token('KW', ">=", 0, 0)
TS.push(KW)

KW = Token('KW', "=", 0, 0)
TS.push(KW)

KW = Token('KW', "<>", 0, 0)
TS.push(KW)

KW = Token('KW', "/", 0, 0)
TS.push(KW)

KW = Token('KW', "*", 0, 0)
TS.push(KW)

KW = Token('KW', "-", 0, 0)
TS.push(KW)

KW = Token('KW', "+", 0, 0)
TS.push(KW)

KW = Token('KW', "nao", 0, 0)
TS.push(KW)

export default TS