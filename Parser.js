const TP = require('./lib/TP.js')

const skip = () => {
  console.log("chamou a função skip dentro do parser")
}

const synch = () => {
  console.log("chamou a função synch dentro do parser")
}

const pilha = []
pilha.push('Compilador')

const table = new TP()

// Lembrar de tratar ID, Numérico e Literal
const parser = token => {
  const itemTopo = pilha[pilha.length - 1]
  
  console.log(itemTopo)
  
  if (pilha.length > 0) {
    if (table.isToken(itemTopo) || itemTopo === 'EOF') {
      if (token === itemTopo) {
        pilha.pop()
        return true
      } else {
        console.log('Erro sintático')
      }
    } else {
      const itemTP = table.getTable()[itemTopo][token]
      if (typeof itemTP === 'object') {
        pilha.pop()
        for (let index = itemTP.length - 1; index >= 0; index--) {
          const element = itemTP[index];
          pilha.push(element)
        }
      }
    }
  } else {
    console.log('Pilha vazia')
    return false
  }
}

parser('algoritmo')
console.log(pilha)
parser('algoritmo')
console.log(pilha)
parser('algoritmo')
console.log(pilha)
