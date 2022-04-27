import { Instruccion } from '../OLC_Abs/Instruccion';
import nodoAST from '../OLC_Abs/Nodo_AST';
import Errores from '../OLC_Excep/Errores';
import Arbol from '../OLC_Simb/Simbolo_Arbol';
import tablaSimbolos from '../OLC_Simb/Simbolo_TablaSimbolos';
import Tipo, { tipoDato } from '../OLC_Simb/Simbolo_Tipo';


export default class Operacion extends Instruccion {
    // tipos de operandos a realizarse
    private operando1: Instruccion | undefined;
    private operando2: Instruccion | undefined;
    private operandoUnico: Instruccion | undefined;
    private operador: Operadores;

    //el metodo constructor, le asigno los valores predeterminados
    constructor(
      operador: Operadores,
      fila: number,
      columna: number,
      op1: Instruccion,
      op2?: Instruccion
    ) {
      super(new Tipo(tipoDato.ENTERO), fila, columna);
      this.operador = operador;
      if (!op2) this.operandoUnico = op1;
      else {
        this.operando1 = op1;
        this.operando2 = op2;
      }
    }
    //para obtener el y realizar operacion
    public getNodo(): nodoAST {
      let nodo = new nodoAST('ARITMETICA');
      if (this.operandoUnico != null) {
        nodo.agregarHijo(this.operador + '');
        nodo.agregarHijoAST(this.operandoUnico.getNodo());
      } else {
        nodo.agregarHijoAST(this.operando1?.getNodo());
        nodo.agregarHijo(this.operador + '', 'ar', this.operador);
        nodo.agregarHijoAST(this.operando2?.getNodo());
      }
      return nodo;
    }

    //para analizar la operacion ingresado
    public interpretar(arbol: Arbol, tabla: tablaSimbolos) {
      let izq, der, uno;
      izq = der = uno = null;
      if (this.operandoUnico != null) {
        uno = this.operandoUnico.interpretar(arbol, tabla);
        if (uno instanceof Errores) return uno;
      } else {
        izq = this.operando1?.interpretar(arbol, tabla);
        if (izq instanceof Errores) return izq;
        der = this.operando2?.interpretar(arbol, tabla);
        if (der instanceof Errores) return der;
      }
      //para ver a cual de las operacioens le pertenece
      switch (this.operador) {
        case Operadores.SUMA:
          return this.operador1Suma(izq, der);
        case Operadores.RESTA:
          return this.operador1Resta(izq, der);
        case Operadores.MULTIPLICACION:
          return this.operador1Multi(izq, der);
        case Operadores.DIVISION:
          return this.operador1Division(izq, der);
        case Operadores.POTENCIA:
          return this.operador1Potencia(izq, der);
        case Operadores.MODULADOR:
          return this.operador1Mod(izq, der);
        case Operadores.MENOSNUM:
          return this.opMenosUnario(uno);
        default:
          return new Errores(
            'ERROR SEMANTICO',
            'OPERADOR INVALIDO',
            this.fila,
            this.columna
          );
      }
    }
  
    //Si es menoesunario
    private opMenosUnario(izq: any) {
      let opUn = this.operandoUnico?.tipoDato.getTipo();
      switch (opUn) {
        case tipoDato.ENTERO:
          this.tipoDato = new Tipo(tipoDato.ENTERO);
          return parseInt(izq) * -1;
        case tipoDato.DECIMAL:
          this.tipoDato = new Tipo(tipoDato.DECIMAL);
          return parseFloat(izq) * -1.0;
      }
    }
   // si es operador de suma
    private operador1Suma(izq: any, der: any) {
      let op1 = this.operando1?.tipoDato.getTipo();
      let op2 = this.operando2?.tipoDato.getTipo();
      switch (
        op1 
      ) {
        case tipoDato.ENTERO:
          return this.op2Suma(1, op2, izq, der);
        case tipoDato.DECIMAL:
          return this.op2Suma(2, op2, izq, der);
        case tipoDato.BOOLEANO:
          return this.op2Suma(3, op2, izq, der);
        case tipoDato.CADENA:
          return this.op2Suma(4, op2, izq, der);
        case tipoDato.CARACTER:
          return this.op2Suma(5, op2, izq, der);
      }
    }
    // si es suma pero tiene dos operandos
    private op2Suma(numero: number, op2: any, izq: any, der: any) {
      if (numero == 1) {
        
        switch (
          op2 
        ) {
          case tipoDato.ENTERO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            return parseInt(izq) + parseInt(der);
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return parseFloat(izq) + parseFloat(der);
          case tipoDato.BOOLEANO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            let dats = der + '';
            let otr = dats.toLowerCase();
            return otr == 'true' ? parseInt(izq) + 1 : parseInt(izq);
          case tipoDato.CADENA: //retorna cadena
            this.tipoDato = new Tipo(tipoDato.CADENA);
            return izq + '' + der;
          case tipoDato.CARACTER: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            var da = der + '';
            var res = da.charCodeAt(0);
            return parseInt(izq) + res;
        }
      } else if (numero == 2) {
        
        switch (
          op2 
        ) {
          case tipoDato.ENTERO: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return parseFloat(izq) + parseFloat(der);
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return parseFloat(izq) + parseFloat(der);
          case tipoDato.BOOLEANO: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            let dats = der + '';
            let otr = dats.toLowerCase();
            return otr == 'true' ? parseFloat(izq) + 1 : parseFloat(izq);
          case tipoDato.CADENA: //retorna cadena
            this.tipoDato = new Tipo(tipoDato.CADENA);
            return izq + '' + der;
          case tipoDato.CARACTER: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            var da = der + '';
            var res = da.charCodeAt(0);
            return parseFloat(izq) + res;
        }
      } else if (numero == 3) {
        //boolean
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            let dats = izq + '';
            let otr = dats.toLowerCase();
            if (otr == 'true') return parseInt(der) + 1;
            return parseInt(der);
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            let dats1 = izq + '';
            let otr1 = dats1.toLowerCase();
            return otr1 == 'true' ? parseFloat(der) + 1 : parseFloat(der);
          case tipoDato.CADENA: //retorna cadena
            this.tipoDato = new Tipo(tipoDato.CADENA);
            return izq + '' + der;
          default:
             //si hay error al operar
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      } else if (numero == 4) {
        //cadena
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna cadena
            this.tipoDato = new Tipo(tipoDato.CADENA);
            return izq + '' + der;
          case tipoDato.DECIMAL: //retorna cadena
            this.tipoDato = new Tipo(tipoDato.CADENA);
            return izq + '' + der;
          case tipoDato.BOOLEANO: //retorna cadena
            this.tipoDato = new Tipo(tipoDato.CADENA);
            return izq + '' + der;
          case tipoDato.CADENA: //retorna cadena
            this.tipoDato = new Tipo(tipoDato.CADENA);
            return izq + '' + der;
          case tipoDato.CARACTER: //retorna cadena
            this.tipoDato = new Tipo(tipoDato.CADENA);
            var dato = der;
            return izq + '' + dato;
        }
      } else if (numero == 5) {
        //caracter
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            var da1 = izq + '';
            var res1 = da1.charCodeAt(0);
            return res1 + parseInt(der);
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            var da1 = izq + '';
            var res1 = da1.charCodeAt(0);
            return res1 + parseFloat(der);
          case tipoDato.CADENA: //retorna cadena
            this.tipoDato = new Tipo(tipoDato.CADENA);
            var otro11 = izq;
            return otro11 + '' + der;
          case tipoDato.CARACTER: //retorna cadena
            this.tipoDato = new Tipo(tipoDato.CADENA);
            var otro = der;
            var otro1 = izq;
            return otro1 + '' + otro;
          default:
             //si hay error al operar semantico
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      }
    }
    // si es resta
    private operador1Resta(izq: any, der: any) {
      let op1 = this.operando1?.tipoDato.getTipo();
      let op2 = this.operando2?.tipoDato.getTipo();
      switch (
        op1 //operador 1
      ) {
        case tipoDato.ENTERO:
          return this.op2Resta(1, op2, izq, der);
        case tipoDato.DECIMAL:
          return this.op2Resta(2, op2, izq, der);
        case tipoDato.BOOLEANO:
          return this.op2Resta(3, op2, izq, der);
        case tipoDato.CADENA:
          return this.op2Resta(4, op2, izq, der);
        case tipoDato.CARACTER:
          return this.op2Resta(5, op2, izq, der);
      }
    }
    private op2Resta(numero: number, op2: any, izq: any, der: any) {
      if (numero == 1) {
        //entero
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            return parseInt(izq) - parseInt(der);
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return parseFloat(izq) - parseFloat(der);
          case tipoDato.BOOLEANO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            let dats = der + '';
            let otr = dats.toLowerCase();
            return otr == 'true' ? parseInt(izq) - 1 : parseInt(izq);
          case tipoDato.CARACTER: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            var da = der + '';
            var res = da.charCodeAt(0);
            return parseInt(izq) - res;
          default:
             //si hay error al operar
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      } else if (numero == 2) {
        //decimal
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return parseFloat(izq) - parseFloat(der);
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return parseFloat(izq) - parseFloat(der);
          case tipoDato.BOOLEANO: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            let dats = der + '';
            let otr = dats.toLowerCase();
            return otr == 'true' ? parseFloat(izq) - 1 : parseFloat(izq);
          case tipoDato.CARACTER: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            var da = der + '';
            var res = da.charCodeAt(0);
            return parseFloat(izq) - res;
          default:
             //si hay error al operar
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      } else if (numero == 3) {
        //boolean
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            let dats = izq + '';
            let otr = dats.toLowerCase();
            return otr == 'true' ? parseInt(der) - 1 : parseInt(der);
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            let dats1 = izq + '';
            let otr1 = dats1.toLowerCase();
            return otr1 == 'true' ? parseFloat(der) - 1 : parseFloat(der);
          default:
             //si hay error al operar
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      } else if (numero == 4) {
        //cadena
        return new Errores(
          'SEMANTICO',
          'TIPO DE DATO NO PERMITIDO',
          this.fila,
          this.columna
        );
      } else if (numero == 5) {
        //caracter
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            var da1 = izq + '';
            var res1 = da1.charCodeAt(0);
            return res1 - parseInt(der);
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            var da1 = izq + '';
            var res1 = da1.charCodeAt(0);
            return res1 - parseFloat(der);
          default:
            //error semantico
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      }
    }
    // si es multiplicacion
    private operador1Multi(izq: any, der: any) {
      let op1 = this.operando1?.tipoDato.getTipo();
      let op2 = this.operando2?.tipoDato.getTipo();
      switch (
        op1 //operador 1
      ) {
        case tipoDato.ENTERO:
          return this.op2Multi(1, op2, izq, der);
        case tipoDato.DECIMAL:
          return this.op2Multi(2, op2, izq, der);
        case tipoDato.BOOLEANO:
          return this.op2Multi(3, op2, izq, der);
        case tipoDato.CADENA:
          return this.op2Multi(4, op2, izq, der);
        case tipoDato.CARACTER:
          return this.op2Multi(5, op2, izq, der);
      }
    }
    private op2Multi(numero: number, op2: any, izq: any, der: any) {
      if (numero == 1) {
        //entero
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            return parseInt(izq) * parseInt(der);
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return parseFloat(izq) * parseFloat(der);
          case tipoDato.CARACTER: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            var da = der + '';
            var res = da.charCodeAt(0);
            return parseInt(izq) * res;
          default:
            //error
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      } else if (numero == 2) {
        //decimal
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return parseFloat(izq) * parseFloat(der);
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return parseFloat(izq) * parseFloat(der);
          case tipoDato.CARACTER: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            var da = der + '';
            var res = da.charCodeAt(0);
            return parseFloat(izq) * res;
          default:
            //error
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      } else if (numero == 3) {
        //boolean
        //si hay error al operar
        return new Errores(
          'SEMANTICO',
          'TIPO DE DATO NO PERMITIDO',
          this.fila,
          this.columna
        );
      } else if (numero == 4) {
        //cadena
         //si hay error al operar
        return new Errores(
          'SEMANTICO',
          'TIPO DE DATO NO PERMITIDO',
          this.fila,
          this.columna
        );
      } else if (numero == 5) {
        //caracter
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            var da1 = izq + '';
            var res1 = da1.charCodeAt(0);
            return res1 * parseInt(der);
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            var da1 = izq + '';
            var res1 = da1.charCodeAt(0);
            return res1 * parseFloat(der);
          default:
            // //si hay error al operar semantico
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      }
    }
    //si es division
    private operador1Division(izq: any, der: any) {
      let op1 = this.operando1?.tipoDato.getTipo();
      let op2 = this.operando2?.tipoDato.getTipo();
      switch (
        op1 //operador 1
      ) {
        case tipoDato.ENTERO:
          return this.op2Division(1, op2, izq, der);
        case tipoDato.DECIMAL:
          return this.op2Division(2, op2, izq, der);
        case tipoDato.BOOLEANO:
          return this.op2Division(3, op2, izq, der);
        case tipoDato.CADENA:
          return this.op2Division(4, op2, izq, der);
        case tipoDato.CARACTER:
          return this.op2Division(5, op2, izq, der);
      }
    }
    private op2Division(numero: number, op2: any, izq: any, der: any) {
      if (numero == 1) {
        //entero
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return der != 0
              ? parseInt(izq) / parseInt(der)
              : 'NO SE PUEDE DIVIDIR SOBRE CERO';
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return der != 0
              ? parseFloat(izq) / parseFloat(der)
              : 'NO SE PUEDE DIVIDIR SOBRE CERO';
          case tipoDato.CARACTER: //retorna entero
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            var da = der + '';
            var res = da.charCodeAt(0);
            return res != 0
              ? parseInt(izq) / res
              : 'NO SE PUEDE DIVIDIR SOBRE CERO';
          default:
             //si hay error al operar
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      } else if (numero == 2) {
        //decimal
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return der != 0
              ? parseFloat(izq) / parseFloat(der)
              : 'NO SE PUEDE DIVIDIR SOBRE CERO';
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return der != 0
              ? parseFloat(izq) / parseFloat(der)
              : 'NO SE PUEDE DIVIDIR SOBRE CERO';
          case tipoDato.CARACTER: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            var da = der + '';
            var res = da.charCodeAt(0);
            return der != 0
              ? parseFloat(izq) / res
              : 'NO SE PUEDE DIVIDIR SOBRE CERO';
          default:
             //si hay error al operar
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      } else if (numero == 3) {
        //boolean
         //si hay error al operar
        return new Errores(
          'SEMANTICO',
          'TIPO DE DATO NO PERMITIDO',
          this.fila,
          this.columna
        );
      } else if (numero == 4) {
        //cadena
         //si hay error al operar
        return new Errores(
          'SEMANTICO',
          'TIPO DE DATO NO PERMITIDO',
          this.fila,
          this.columna
        );
      } else if (numero == 5) {
        //caracter
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            var da1 = izq + '';
            var res1 = da1.charCodeAt(0);
            return der != 0
              ? res1 / parseInt(der)
              : 'NO SE PUEDE DIVIDIR SOBRE CERO';
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            var da1 = izq + '';
            var res1 = da1.charCodeAt(0);
            return der != 0
              ? res1 / parseFloat(der)
              : 'NO SE PUEDE DIVIDIR SOBRE CERO';
          default:
            //error semantico
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      }
    }
    // SI es potencia
    private operador1Potencia(izq: any, der: any) {
      let op1 = this.operando1?.tipoDato.getTipo();
      let op2 = this.operando2?.tipoDato.getTipo();
      switch (
        op1 //operador 1
      ) {
        case tipoDato.ENTERO:
          return this.op2Potencia(1, op2, izq, der);
        case tipoDato.DECIMAL:
          return this.op2Potencia(2, op2, izq, der);
        case tipoDato.BOOLEANO:
          return this.op2Potencia(3, op2, izq, der);
        case tipoDato.CADENA:
          return this.op2Potencia(4, op2, izq, der);
        case tipoDato.CARACTER:
          return this.op2Potencia(5, op2, izq, der);
      }
    }
    private op2Potencia(numero: number, op2: any, izq: any, der: any) {
      if (numero == 1) {
        //entero
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            return Math.pow(parseInt(izq), parseInt(der));
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return Math.pow(parseFloat(izq), parseFloat(der));
          default:
             //si hay error al operar
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      } else if (numero == 2) {
        //decimal
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return Math.pow(parseFloat(izq), parseFloat(der));
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return Math.pow(parseFloat(izq), parseFloat(der));
          default:
             //si hay error al operar
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      } else if (numero == 3) {
        //boolean
         //si hay error al operar
        return new Errores(
          'SEMANTICO',
          'TIPO DE DATO NO PERMITIDO',
          this.fila,
          this.columna
        );
      } else if (numero == 4) {
        //cadena
         //si hay error al operar
        return new Errores(
          'SEMANTICO',
          'TIPO DE DATO NO PERMITIDO',
          this.fila,
          this.columna
        );
      } else if (numero == 5) {
        //caracter
         //si hay error al operar
        return new Errores(
          'SEMANTICO',
          'TIPO DE DATO NO PERMITIDO',
          this.fila,
          this.columna
        );
      }
    }
    // si es residu %
    private operador1Mod(izq: any, der: any) {
      let op1 = this.operando1?.tipoDato.getTipo();
      let op2 = this.operando2?.tipoDato.getTipo();
      switch (
        op1 //operador 1
      ) {
        case tipoDato.ENTERO:
          return this.op2Mod(1, op2, izq, der);
        case tipoDato.DECIMAL:
          return this.op2Mod(2, op2, izq, der);
        case tipoDato.BOOLEANO:
          return this.op2Mod(3, op2, izq, der);
        case tipoDato.CADENA:
          return this.op2Mod(4, op2, izq, der);
        case tipoDato.CARACTER:
          return this.op2Mod(5, op2, izq, der);
      }
    }
    private op2Mod(numero: number, op2: any, izq: any, der: any) {
      if (numero == 1) {
        //entero
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna entero
            this.tipoDato = new Tipo(tipoDato.ENTERO);
            return parseInt(izq) % parseInt(der);
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return parseFloat(izq) % parseFloat(der);
          default:
            //si hay error al operar
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      } else if (numero == 2) {
        //decimal
        switch (
          op2 //OPERADOR 2
        ) {
          case tipoDato.ENTERO: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return parseFloat(izq) % parseFloat(der);
          case tipoDato.DECIMAL: //retorna decimal
            this.tipoDato = new Tipo(tipoDato.DECIMAL);
            return parseFloat(izq) % parseFloat(der);
          default:
             //si hay error al operar
            return new Errores(
              'SEMANTICO',
              'TIPO DE DATO NO PERMITIDO',
              this.fila,
              this.columna
            );
        }
      } else if (numero == 3) {
        //boolean
         //si hay error al operar
        return new Errores(
          'SEMANTICO',
          'TIPO DE DATO NO PERMITIDO',
          this.fila,
          this.columna
        );
      } else if (numero == 4) {
        //cadena
         //si hay error al operar
        return new Errores(
          'SEMANTICO',
          'TIPO DE DATO NO PERMITIDO',
          this.fila,
          this.columna
        );
      } else if (numero == 5) {
        //caracter
         //si hay error al operar
        return new Errores(
          'SEMANTICO',
          'TIPO DE DATO NO PERMITIDO',
          this.fila,
          this.columna
        );
      }
    }
  }
  export enum Operadores {
    SUMA,
    RESTA,
    MULTIPLICACION,
    DIVISION,
    POTENCIA,
    MODULADOR,
    MENOSNUM,
  }
  