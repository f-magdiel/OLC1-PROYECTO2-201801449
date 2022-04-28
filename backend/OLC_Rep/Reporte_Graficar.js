"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
var fs = require('fs');
let cuerpo = '';
let contador = 0;
function graficarArbol(arbolitos) {
    // variable para contar la grafica en graphviz
    contador = 1;
    cuerpo = '';
    //meotodo para graficar con graphviz
    graphAST('n0', arbolitos);
    let principal = `digraph arbolAST{ 
      n0[label="${arbolitos.getValor().replace('"', '\\"')}"];
      ${cuerpo}
    }`;
    fs.writeFile('../front/src/assets/img/reporteAST.dot', principal, () => { }); // escribe el archivo .dot para graficar
    (0, child_process_1.exec)('dot -Tsvg ../front/src/assets/img/reporteAST.dot -o ../front/src/assets/img/reporteAST.svg', (error, stdout, stderr) => {
        if (error) {
            return;
        }
        if (stderr) {
            return;
        }
    });
}
exports.default = graficarArbol;
//para obtener cada valor 
function graphAST(texto, padre) {
    for (let hijo of padre.getHijos()) {
        let nombreHijo = `n${contador}`;
        cuerpo += `${nombreHijo}[label="${hijo.getValor().replace('"', '\\"')}"];
      ${texto} -> ${nombreHijo};`;
        contador++;
        graphAST(nombreHijo, hijo);
    }
}
