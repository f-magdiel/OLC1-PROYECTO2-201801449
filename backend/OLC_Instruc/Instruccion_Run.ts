import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';
import Declaracion from './Instruccion_Declaracion';
import Metodos from './Instruccion_Metodos';

export default class Exec extends Instruccion {
  //variable para la instruccion RUN, ejecuta el programa
  private identificador: String;
  private parametros: Instruccion[];

  //el metodo constructor
  constructor(
    identificador: String,
    parametros: Instruccion[],
    fila: number,
    columna: number
  ) {
    super(new Tipo(tipoDato.ENTERO), fila, columna);
    this.identificador = identificador.toLowerCase();
    this.parametros = parametros;
  }

 
  //metodo para analizar los valores ingresados
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    let funcion = arbol.getFuncion(this.identificador);
    if (funcion == null)
      return new Errores(
        'SEMANTICO',
        'NO SE ENCONTRO LA FUNCION',
        this.fila,
        this.columna
      );
    if (funcion instanceof Metodos) {
      let metodo = <Metodos>funcion;
      if (metodo.parametros.length == this.parametros?.length) {
        let nuevaTabla = new tablaSimbolos(arbol.gettablaGlobal());
        for (let param = 0; param < this.parametros.length; param++) {
          let newVal = this.parametros[param].interpretar(arbol, tabla);
          if (newVal instanceof Errores) return newVal;
          let dec = new Declaracion(
            metodo.parametros[param].tipato,
            metodo.fila,
            metodo.columna,
            metodo.parametros[param].identificador
          );
          let nuevaDec = dec.interpretar(arbol, nuevaTabla);
          if (nuevaDec instanceof Errores) return nuevaDec;

          let variable = nuevaTabla.getVariable(
            metodo.parametros[param].identificador
          );
          if (variable != null) {
            if (
              variable.gettipo().getTipo() !=
              this.parametros[param].tipoDato.getTipo()
            ) {
              return new Errores(
                'SEMANTICO',
                'VARIABLE ' +
                  metodo.parametros[param].identificador +
                  ' TIPOS DE DATOS DIFERENTES',
                this.fila,
                this.columna
              );
            } else {
              variable.setvalor(newVal);
              nuevaTabla.setNombre(funcion.identificador);
            }
          } else {
            return new Errores(
              'SEMANTICO',
              'VARIABLE ' +
                metodo.parametros[param].identificador +
                ' NO EXISTE',
              this.fila,
              this.columna
            );
          }
        }
        let nuevMet = metodo.interpretar(arbol, nuevaTabla);
        if (nuevMet instanceof Errores) return nuevMet;
      } else {
        return new Errores(
          'SEMANTICO',
          'PARAMETROS NO COINCIDENTES',
          this.fila,
          this.columna
        );
      }
    }
  }

   //metodo para obtener un nodo
   public getNodo(): Nodo {
    let nodo = new Nodo('RUN');
    nodo.agregarHijo('run');
    nodo.agregarHijo(this.identificador + '');
    nodo.agregarHijo('(');
    this.parametros.forEach((element) => {
      nodo.agregarHijoAST(element.getNodo());
    });
    nodo.agregarHijo(')');
    nodo.agregarHijo(';');
    return nodo;
  }

}
