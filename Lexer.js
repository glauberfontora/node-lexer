const TS = require('./lib/TS.js')
let EOF
let lookahead = 0
let line = 1
let column = 1

const showError = mensagem => {
  console.log(`[Erro Lexico]: ${mensagem}`)
}

// const pointerBack = () => {
//   try {
//      // Não é necessário retornar o ponteiro em caso de Fim de Arquivo
//      if(lookahead != END_OF_FILE) {
//         instance_file.seek(instance_file.getFilePointer() - 1);
//      }    
//   }
//   catch(IOException e) {
//      System.out.println("Falha ao retornar a leitura\n" + e);
//      System.exit(4);
//   }
// }

// Imprimir tabela de símbolos
console.log("Tabela de simbolos:")
TS.getTS()