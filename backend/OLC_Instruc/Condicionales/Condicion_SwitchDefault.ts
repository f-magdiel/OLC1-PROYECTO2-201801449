import { listaErrores } from '../../indexControllers';
import { Instruccion } from '../../OLC_Abs/Instruccion';
import nodoAST from '../../OLC_Abs/Nodo_AST';
import Errores from '../../OLC_Excep/Errores';
import Arbol from '../../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../../OLC_Simb/Simbolo_Tipo';
import Return from '../Instruccion_Return';

export default class condSwitchCase extends Instruccion {
  private instrucciones: Instruccion[];
  constructor(fila: number, columna: number, instrucciones: Instruccion[]) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.instrucciones = instrucciones;
  }
  public getNodo(): nodoAST {
    let nodo = new nodoAST('DEFAULT');
    nodo.agregarHijo('default');
    nodo.agregarHijo(':');
    this.instrucciones.forEach((element) => {
      nodo.agregarHijoAST(element.getNodo());
    });
    return nodo;
  }
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    let nuevaTabla = new tablaSimbolos(tabla);
    nuevaTabla.setNombre('default');
    for (let i = 0; i < this.instrucciones.length; i++) {
      let a = this.instrucciones[i].interpretar(arbol, nuevaTabla);
      if (a instanceof Errores) {
        listaErrores.push(a);
        arbol.actualizaConsola((<Errores>a).returnError());
      }
      if (a instanceof Return) return a;
      if (a == 'ByLyContinue') return a;
      if (a == 'ByLy23') return a;
    }
  }
}
