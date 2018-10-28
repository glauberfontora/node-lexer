const skip = () =>{
    console.log("chamou a função skip")
}

const synch = () =>{
    console.log("chamou a função synch")
}

const EMPILHA = () =>{
    let tam = Object.keys(TP).length
    let x = 0
    let y = Object.keys(TP.Compilador).length
    let z = 0
    let n1 = Object.keys(TP)
    for(x;x < tam;x++){
        if(Array.isArray(TP.Compilador.algoritmo)){
            const PILHA = []
            console.log(n1)
        }
        z++
    }
}

const TP = {
    Compilador:{
        "algoritmo":["Programa" , "EOF"],
"fim":skip,
"declare":skip,
";"	:skip,
"subrotina":skip,
ID:skip,
"("	:skip,
")":skip,
","	:skip,
"retorne":skip,
"logico":skip,
"numerico":skip,
"literal":skip,
"nulo":skip,
"se":skip,
"inicio":skip,
"senao":skip,
"enquanto":skip,
"faca":skip,
"para":skip,
"ate":skip,
"repita":skip,
"<--":skip,
"escreva":skip,
"leia":skip,
Numerico:skip,
Literal:skip,
"verdadeiro":skip,
"falso":skip,
"Ou":skip,
"E":skip,
"<":skip,
"<=":skip,
">":skip,
">=":skip,
"=":skip,
"<>":skip,
"-":skip,
"+":skip,
"/":skip,
"*":skip,
"Nao":skip,
$:EMPILHA,
    },

Programa:{},
Programa1:{},
Programa2:{},
DeclaraVar:{},
ListaRotina:{},
ListaRotina1:{},
Rotina:{},
Rotina1:{},
Rotina2:{},
ListaParam:{},
ListaParam1:{},
Param:{},
ListaID:{},
ListaID1:{},
Retorno:{},
Tipo:{},
ListaCmd:{},
ListaCmd1:{},
Cmd:{},
Cmd1:{},
CmdSe:{},
CmdSe1:{},
CmdEnquanto:{},
CmdPara:{},
CmdRepita:{},
CmdAtrib:{},
CmdChamaRotina:{},
CmdChamaRotina1:{},
CmdChamaRotina2:{},
CmdEscreva:{},
CmdLeia:{},
Expressao:{},
Expressao1:{},
Expressao2:{},
Expressao3:{},
Expressao4:{},
Expressao5:{},
Op:{},
Op1:{},
Op2:{},
Op3:{},
OpUnario:{},
}

console.log(TP.Compilador.$.call())