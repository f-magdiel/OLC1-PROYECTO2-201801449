import obtenerValor from '../OLC_Rep/Reporte_CambiarTipo';
import { reporteTabla } from '../OLC_Rep/Reporte_ReporteTabla';
import { Instruccion } from '../OLC_Abs/Instruccion';
import Nodo from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import Simbolo from '../OLC_Simb/Simbolo_Simbolo';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';

export default class declaracionVectores extends Instruccion {

  //variables para declaracion de vectores
  private tipo: Tipo;
  private identificador: string;
  private tipoDeclaracion: boolean; //true tipo 1 false tipo 2
  private cantidad?: Instruccion;// estos son opcioneales, que pueden venir o no
  private tipoVector?: Tipo;
  private listaValores?: Instruccion[];

  //el metodo constructor
  constructor(
    tipo: Tipo,
    identificador: string,
    tipoDeclaracion: boolean,
    fila: number,
    columna: number,
    cantidad?: Instruccion,
    tipoVector?: Tipo,
    listaValores?: Instruccion[]
  ) {
    super(tipo, fila, columna);
    this.tipo = tipo;
    this.identificador = identificador;
    this.tipoDeclaracion = tipoDeclaracion;
    this.cantidad = cantidad;
    this.tipoVector = tipoVector;
    this.listaValores = listaValores;
  }

  //metodo para analizar los valores ingresados
  public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
    if (this.tipoDeclaracion) {
      if (this.tipoVector == null)
        return new Errores(
          'SINTACTICO',
          'NO EXISTE TIPO DE DATO DE VECTOR',
          this.fila,
          this.columna
        );
      if (this.tipo.getTipo() != this.tipoVector?.getTipo())
        return new Errores(
          'SEMANTICO',
          'TIPOS DE DATOS DIFERENTES EN DECLARACION',
          this.fila,
          this.columna
        );
      else {
        let numero = this.cantidad?.interpretar(arbol, tabla);
        if (numero instanceof Errores) return numero;
        if (this.cantidad?.tipoDato.getTipo() != tipoDato.ENTERO)
          return new Errores(
            'SEMANTICO',
            'VARIABLE NO ES TIPO ENTERO',
            this.fila,
            this.columna
          );
        let num = parseInt(numero);
        let arreglo: any = [];
        for (let i = 0; i < num; i++) {
          arreglo[i] = [];
        }
        if (
          tabla.setVariable(
            new Simbolo(this.tipo, this.identificador, arreglo)
          ) == 'La variable existe actualmente'
        )
          return new Errores(
            'SEMANTICO',
            'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE',
            this.fila,
            this.columna
          );
        else {
          if (
            !arbol.actualizarTabla(
              this.identificador,
              arreglo,
              this.fila.toString(),
              tabla.getNombre().toString(),
              this.columna.toString()
            )
          ) {
            let nuevoSimbolo = new reporteTabla(
              this.identificador,
              arreglo,
              'vector',
              obtenerValor(this.tipo.getTipo()) + '',
              tabla.getNombre(),
              this.fila.toString(),
              this.columna.toString()
            );
            arbol.listaSimbolos.push(nuevoSimbolo);
          }
        }
      }
    } else {
      let arreglo: any = [];
      if (this.listaValores == null) this.listaValores = [];
      for (let i = 0; i < this.listaValores.length; i++) {
        let valor = this.listaValores[i].interpretar(arbol, tabla);
        if (valor instanceof Errores) return valor;
        if (this.tipo.getTipo() != this.listaValores[i].tipoDato.getTipo())
          return new Errores(
            'SEMANTICO',
            'TIPO DE DATO DIFERENTE',
            this.fila,
            this.columna
          );
        arreglo[i] = valor;
      }
      if (
        tabla.setVariable(
          new Simbolo(this.tipo, this.identificador, arreglo)
        ) == 'La variable existe actualmente'
      )
        return new Errores(
          'SEMANTICO',
          'LA VARIABLE ' + this.identificador + ' EXISTE ACTUALMENTE',
          this.fila,
          this.columna
        );
      else {
        if (
          !arbol.actualizarTabla(
            this.identificador,
            arreglo,
            this.fila.toString(),
            tabla.getNombre().toString(),
            this.columna.toString()
          )
        ) {
          let nuevoSimbolo = new reporteTabla(
            this.identificador,
            arreglo,
            'vector',
            obtenerValor(this.tipo.getTipo()) + '',
            tabla.getNombre(),
            this.fila.toString(),
            this.columna.toString()
          );
          arbol.listaSimbolos.push(nuevoSimbolo);
        }
      }
      
    }
  }

   //metodo para obtener Nodo
   public getNodo() {
    let nodo = new Nodo('VECTORES');
    nodo.agregarHijo(obtenerValor(this.tipo.getTipo()) + '');
    nodo.agregarHijo(this.identificador);
    nodo.agregarHijo('[');
    nodo.agregarHijo(']');
    nodo.agregarHijo('=');
    if (this.tipoDeclaracion) {
      nodo.agregarHijo('[');
      nodo.agregarHijoAST(this.cantidad?.getNodo());
      nodo.agregarHijo(']');
    } else {
      nodo.agregarHijo('[');
      this.listaValores?.forEach((res) => {
        nodo.agregarHijoAST(res.getNodo());
        nodo.agregarHijo(',');
      });
      nodo.agregarHijo(']');
    }
    nodo.agregarHijo(';');
    return nodo;
  }
}
