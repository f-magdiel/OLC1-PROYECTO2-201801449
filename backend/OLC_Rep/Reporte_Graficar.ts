import Nodo from '../OLC_Abs/Nodo_AST';
import { exec } from 'child_process';
var fs = require('fs');
let cuerpo = '';
let contador = 0;
export default function graficarArbol(arbolitos: Nodo) {
  // variable para contar la grafica en graphviz
  contador = 1;
  cuerpo = '';
  
  //meotodo para graficar con graphviz
  graphAST('n0', arbolitos);
  let principal = `digraph arbolAST{ 
      n0[label="${arbolitos.getValor().replace('"', '\\"')}"];
      ${cuerpo}
    }`;
  fs.writeFile('../front/src/assets/img/reporteAST.dot', principal, () => {}); // escribe el archivo .dot para graficar
  exec(
    'dot -Tsvg ../front/src/assets/img/reporteAST.dot -o ../front/src/assets/img/reporteAST.svg',
    (error, stdout, stderr) => {
      if (error) {
        return;
      }
      if (stderr) {
        return;
      }
    }
  );
}

//para obtener cada valor 
function graphAST(texto: string, padre: Nodo) {
  for (let hijo of padre.getHijos()) {
    let nombreHijo = `n${contador}`;
    cuerpo += `${nombreHijo}[label="${hijo.getValor().replace('"', '\\"')}"];
      ${texto} -> ${nombreHijo};`;
    contador++;
    graphAST(nombreHijo, hijo);
  }
}
