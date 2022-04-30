"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operadores = void 0;
const Instruccion_1 = require("../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("../OLC_Excep/Errores"));
const Simbolo_Tipo_1 = __importStar(require("../OLC_Simb/Simbolo_Tipo"));
class Operacion extends Instruccion_1.Instruccion {
    //el metodo constructor, le asigno los valores predeterminados
    constructor(operador, fila, columna, op1, op2) {
        super(new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO), fila, columna);
        this.operador = operador;
        if (!op2)
            this.operandoUnico = op1;
        else {
            this.operando1 = op1;
            this.operando2 = op2;
        }
    }
    //para obtener el y realizar operacion
    getNodo() {
        var _a, _b;
        let nodo = new Nodo_AST_1.default('ARITMETICA');
        if (this.operandoUnico != null) {
            nodo.agregarHijo(this.operador + '');
            nodo.agregarHijoAST(this.operandoUnico.getNodo());
        }
        else {
            nodo.agregarHijoAST((_a = this.operando1) === null || _a === void 0 ? void 0 : _a.getNodo());
            nodo.agregarHijo(this.operador + '', 'ar', this.operador);
            nodo.agregarHijoAST((_b = this.operando2) === null || _b === void 0 ? void 0 : _b.getNodo());
        }
        return nodo;
    }
    //para analizar la operacion ingresado
    interpretar(arbol, tabla) {
        var _a, _b;
        let izq, der, uno;
        izq = der = uno = null;
        if (this.operandoUnico != null) {
            uno = this.operandoUnico.interpretar(arbol, tabla);
            if (uno instanceof Errores_1.default)
                return uno;
        }
        else {
            izq = (_a = this.operando1) === null || _a === void 0 ? void 0 : _a.interpretar(arbol, tabla);
            if (izq instanceof Errores_1.default)
                return izq;
            der = (_b = this.operando2) === null || _b === void 0 ? void 0 : _b.interpretar(arbol, tabla);
            if (der instanceof Errores_1.default)
                return der;
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
                return new Errores_1.default('ERROR SEMANTICO', 'OPERADOR INVALIDO', this.fila, this.columna);
        }
    }
    //Si es menoesunario
    opMenosUnario(izq) {
        var _a;
        let opUn = (_a = this.operandoUnico) === null || _a === void 0 ? void 0 : _a.tipoDato.getTipo();
        switch (opUn) {
            case Simbolo_Tipo_1.tipoDato.ENTERO:
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                return parseInt(izq) * -1;
            case Simbolo_Tipo_1.tipoDato.DECIMAL:
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                return parseFloat(izq) * -1.0;
        }
    }
    // si es operador de suma
    operador1Suma(izq, der) {
        var _a, _b;
        let op1 = (_a = this.operando1) === null || _a === void 0 ? void 0 : _a.tipoDato.getTipo();
        let op2 = (_b = this.operando2) === null || _b === void 0 ? void 0 : _b.tipoDato.getTipo();
        switch (op1) {
            case Simbolo_Tipo_1.tipoDato.ENTERO:
                return this.op2Suma(1, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.DECIMAL:
                return this.op2Suma(2, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.BOOLEANO:
                return this.op2Suma(3, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.CADENA:
                return this.op2Suma(4, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.CARACTER:
                return this.op2Suma(5, op2, izq, der);
        }
    }
    // si es suma pero tiene dos operandos
    op2Suma(numero, op2, izq, der) {
        if (numero == 1) {
            switch (op2) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    return parseInt(izq) + parseInt(der);
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return parseFloat(izq) + parseFloat(der);
                case Simbolo_Tipo_1.tipoDato.BOOLEANO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    let dats = der + '';
                    let otr = dats.toLowerCase();
                    return otr == 'true' ? parseInt(izq) + 1 : parseInt(izq);
                case Simbolo_Tipo_1.tipoDato.CADENA: //retorna cadena
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                    return izq + '' + der;
                case Simbolo_Tipo_1.tipoDato.CARACTER: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    var da = der + '';
                    var res = da.charCodeAt(0);
                    return parseInt(izq) + res;
            }
        }
        else if (numero == 2) {
            switch (op2) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return parseFloat(izq) + parseFloat(der);
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return parseFloat(izq) + parseFloat(der);
                case Simbolo_Tipo_1.tipoDato.BOOLEANO: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    let dats = der + '';
                    let otr = dats.toLowerCase();
                    return otr == 'true' ? parseFloat(izq) + 1 : parseFloat(izq);
                case Simbolo_Tipo_1.tipoDato.CADENA: //retorna cadena
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                    return izq + '' + der;
                case Simbolo_Tipo_1.tipoDato.CARACTER: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    var da = der + '';
                    var res = da.charCodeAt(0);
                    return parseFloat(izq) + res;
            }
        }
        else if (numero == 3) {
            //boolean
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    let dats = izq + '';
                    let otr = dats.toLowerCase();
                    if (otr == 'true')
                        return parseInt(der) + 1;
                    return parseInt(der);
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    let dats1 = izq + '';
                    let otr1 = dats1.toLowerCase();
                    return otr1 == 'true' ? parseFloat(der) + 1 : parseFloat(der);
                case Simbolo_Tipo_1.tipoDato.CADENA: //retorna cadena
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                    return izq + '' + der;
                default:
                    //si hay error al operar
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
        else if (numero == 4) {
            //cadena
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna cadena
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                    return izq + '' + der;
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna cadena
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                    return izq + '' + der;
                case Simbolo_Tipo_1.tipoDato.BOOLEANO: //retorna cadena
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                    return izq + '' + der;
                case Simbolo_Tipo_1.tipoDato.CADENA: //retorna cadena
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                    return izq + '' + der;
                case Simbolo_Tipo_1.tipoDato.CARACTER: //retorna cadena
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                    var dato = der;
                    return izq + '' + dato;
            }
        }
        else if (numero == 5) {
            //caracter
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    var da1 = izq + '';
                    var res1 = da1.charCodeAt(0);
                    return res1 + parseInt(der);
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    var da1 = izq + '';
                    var res1 = da1.charCodeAt(0);
                    return res1 + parseFloat(der);
                case Simbolo_Tipo_1.tipoDato.CADENA: //retorna cadena
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                    var otro11 = izq;
                    return otro11 + '' + der;
                case Simbolo_Tipo_1.tipoDato.CARACTER: //retorna cadena
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                    var otro = der;
                    var otro1 = izq;
                    return otro1 + '' + otro;
                default:
                    //si hay error al operar semantico
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
    }
    // si es resta
    operador1Resta(izq, der) {
        var _a, _b;
        let op1 = (_a = this.operando1) === null || _a === void 0 ? void 0 : _a.tipoDato.getTipo();
        let op2 = (_b = this.operando2) === null || _b === void 0 ? void 0 : _b.tipoDato.getTipo();
        switch (op1 //operador 1
        ) {
            case Simbolo_Tipo_1.tipoDato.ENTERO:
                return this.op2Resta(1, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.DECIMAL:
                return this.op2Resta(2, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.BOOLEANO:
                return this.op2Resta(3, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.CADENA:
                return this.op2Resta(4, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.CARACTER:
                return this.op2Resta(5, op2, izq, der);
        }
    }
    op2Resta(numero, op2, izq, der) {
        if (numero == 1) {
            //entero
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    return parseInt(izq) - parseInt(der);
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return parseFloat(izq) - parseFloat(der);
                case Simbolo_Tipo_1.tipoDato.BOOLEANO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    let dats = der + '';
                    let otr = dats.toLowerCase();
                    return otr == 'true' ? parseInt(izq) - 1 : parseInt(izq);
                case Simbolo_Tipo_1.tipoDato.CARACTER: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    var da = der + '';
                    var res = da.charCodeAt(0);
                    return parseInt(izq) - res;
                default:
                    //si hay error al operar
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
        else if (numero == 2) {
            //decimal
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return parseFloat(izq) - parseFloat(der);
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return parseFloat(izq) - parseFloat(der);
                case Simbolo_Tipo_1.tipoDato.BOOLEANO: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    let dats = der + '';
                    let otr = dats.toLowerCase();
                    return otr == 'true' ? parseFloat(izq) - 1 : parseFloat(izq);
                case Simbolo_Tipo_1.tipoDato.CARACTER: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    var da = der + '';
                    var res = da.charCodeAt(0);
                    return parseFloat(izq) - res;
                default:
                    //si hay error al operar
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
        else if (numero == 3) {
            //boolean
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    let dats = izq + '';
                    let otr = dats.toLowerCase();
                    return otr == 'true' ? parseInt(der) - 1 : parseInt(der);
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    let dats1 = izq + '';
                    let otr1 = dats1.toLowerCase();
                    return otr1 == 'true' ? parseFloat(der) - 1 : parseFloat(der);
                default:
                    //si hay error al operar
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
        else if (numero == 4) {
            //cadena
            return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
        }
        else if (numero == 5) {
            //caracter
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    var da1 = izq + '';
                    var res1 = da1.charCodeAt(0);
                    return res1 - parseInt(der);
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    var da1 = izq + '';
                    var res1 = da1.charCodeAt(0);
                    return res1 - parseFloat(der);
                default:
                    //error semantico
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
    }
    // si es multiplicacion
    operador1Multi(izq, der) {
        var _a, _b;
        let op1 = (_a = this.operando1) === null || _a === void 0 ? void 0 : _a.tipoDato.getTipo();
        let op2 = (_b = this.operando2) === null || _b === void 0 ? void 0 : _b.tipoDato.getTipo();
        switch (op1 //operador 1
        ) {
            case Simbolo_Tipo_1.tipoDato.ENTERO:
                return this.op2Multi(1, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.DECIMAL:
                return this.op2Multi(2, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.BOOLEANO:
                return this.op2Multi(3, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.CADENA:
                return this.op2Multi(4, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.CARACTER:
                return this.op2Multi(5, op2, izq, der);
        }
    }
    op2Multi(numero, op2, izq, der) {
        if (numero == 1) {
            //entero
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    return parseInt(izq) * parseInt(der);
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return parseFloat(izq) * parseFloat(der);
                case Simbolo_Tipo_1.tipoDato.CARACTER: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    var da = der + '';
                    var res = da.charCodeAt(0);
                    return parseInt(izq) * res;
                default:
                    //error
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
        else if (numero == 2) {
            //decimal
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return parseFloat(izq) * parseFloat(der);
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return parseFloat(izq) * parseFloat(der);
                case Simbolo_Tipo_1.tipoDato.CARACTER: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    var da = der + '';
                    var res = da.charCodeAt(0);
                    return parseFloat(izq) * res;
                default:
                    //error
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
        else if (numero == 3) {
            //boolean
            //si hay error al operar
            return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
        }
        else if (numero == 4) {
            //cadena
            //si hay error al operar
            return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
        }
        else if (numero == 5) {
            //caracter
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    var da1 = izq + '';
                    var res1 = da1.charCodeAt(0);
                    return res1 * parseInt(der);
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    var da1 = izq + '';
                    var res1 = da1.charCodeAt(0);
                    return res1 * parseFloat(der);
                default:
                    // //si hay error al operar semantico
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
    }
    //si es division
    operador1Division(izq, der) {
        var _a, _b;
        let op1 = (_a = this.operando1) === null || _a === void 0 ? void 0 : _a.tipoDato.getTipo();
        let op2 = (_b = this.operando2) === null || _b === void 0 ? void 0 : _b.tipoDato.getTipo();
        switch (op1 //operador 1
        ) {
            case Simbolo_Tipo_1.tipoDato.ENTERO:
                return this.op2Division(1, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.DECIMAL:
                return this.op2Division(2, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.BOOLEANO:
                return this.op2Division(3, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.CADENA:
                return this.op2Division(4, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.CARACTER:
                return this.op2Division(5, op2, izq, der);
        }
    }
    op2Division(numero, op2, izq, der) {
        if (numero == 1) {
            //entero
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    return der != 0
                        ? parseInt(izq) / parseInt(der)
                        : 'NO SE PUEDE DIVIDIR SOBRE CERO';
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return der != 0
                        ? parseFloat(izq) / parseFloat(der)
                        : 'NO SE PUEDE DIVIDIR SOBRE CERO';
                case Simbolo_Tipo_1.tipoDato.CARACTER: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    var da = der + '';
                    var res = da.charCodeAt(0);
                    return res != 0
                        ? parseInt(izq) / res
                        : 'NO SE PUEDE DIVIDIR SOBRE CERO';
                default:
                    //si hay error al operar
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
        else if (numero == 2) {
            //decimal
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return der != 0
                        ? parseFloat(izq) / parseFloat(der)
                        : 'NO SE PUEDE DIVIDIR SOBRE CERO';
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return der != 0
                        ? parseFloat(izq) / parseFloat(der)
                        : 'NO SE PUEDE DIVIDIR SOBRE CERO';
                case Simbolo_Tipo_1.tipoDato.CARACTER: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    var da = der + '';
                    var res = da.charCodeAt(0);
                    return der != 0
                        ? parseFloat(izq) / res
                        : 'NO SE PUEDE DIVIDIR SOBRE CERO';
                default:
                    //si hay error al operar
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
        else if (numero == 3) {
            //boolean
            //si hay error al operar
            return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
        }
        else if (numero == 4) {
            //cadena
            //si hay error al operar
            return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
        }
        else if (numero == 5) {
            //caracter
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    var da1 = izq + '';
                    var res1 = da1.charCodeAt(0);
                    return der != 0
                        ? res1 / parseInt(der)
                        : 'NO SE PUEDE DIVIDIR SOBRE CERO';
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    var da1 = izq + '';
                    var res1 = da1.charCodeAt(0);
                    return der != 0
                        ? res1 / parseFloat(der)
                        : 'NO SE PUEDE DIVIDIR SOBRE CERO';
                default:
                    //error semantico
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
    }
    // SI es potencia
    operador1Potencia(izq, der) {
        var _a, _b;
        let op1 = (_a = this.operando1) === null || _a === void 0 ? void 0 : _a.tipoDato.getTipo();
        let op2 = (_b = this.operando2) === null || _b === void 0 ? void 0 : _b.tipoDato.getTipo();
        switch (op1 //operador 1
        ) {
            case Simbolo_Tipo_1.tipoDato.ENTERO:
                return this.op2Potencia(1, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.DECIMAL:
                return this.op2Potencia(2, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.BOOLEANO:
                return this.op2Potencia(3, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.CADENA:
                return this.op2Potencia(4, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.CARACTER:
                return this.op2Potencia(5, op2, izq, der);
        }
    }
    op2Potencia(numero, op2, izq, der) {
        if (numero == 1) {
            //entero
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    return Math.pow(parseInt(izq), parseInt(der));
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return Math.pow(parseFloat(izq), parseFloat(der));
                default:
                    //si hay error al operar
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
        else if (numero == 2) {
            //decimal
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return Math.pow(parseFloat(izq), parseFloat(der));
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return Math.pow(parseFloat(izq), parseFloat(der));
                default:
                    //si hay error al operar
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
        else if (numero == 3) {
            //boolean
            //si hay error al operar
            return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
        }
        else if (numero == 4) {
            //cadena
            //si hay error al operar
            return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
        }
        else if (numero == 5) {
            //caracter
            //si hay error al operar
            return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
        }
    }
    // si es residu %
    operador1Mod(izq, der) {
        var _a, _b;
        let op1 = (_a = this.operando1) === null || _a === void 0 ? void 0 : _a.tipoDato.getTipo();
        let op2 = (_b = this.operando2) === null || _b === void 0 ? void 0 : _b.tipoDato.getTipo();
        switch (op1 //operador 1
        ) {
            case Simbolo_Tipo_1.tipoDato.ENTERO:
                return this.op2Mod(1, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.DECIMAL:
                return this.op2Mod(2, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.BOOLEANO:
                return this.op2Mod(3, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.CADENA:
                return this.op2Mod(4, op2, izq, der);
            case Simbolo_Tipo_1.tipoDato.CARACTER:
                return this.op2Mod(5, op2, izq, der);
        }
    }
    op2Mod(numero, op2, izq, der) {
        if (numero == 1) {
            //entero
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna entero
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                    return parseInt(izq) % parseInt(der);
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return parseFloat(izq) % parseFloat(der);
                default:
                    //si hay error al operar
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
        else if (numero == 2) {
            //decimal
            switch (op2 //OPERADOR 2
            ) {
                case Simbolo_Tipo_1.tipoDato.ENTERO: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return parseFloat(izq) % parseFloat(der);
                case Simbolo_Tipo_1.tipoDato.DECIMAL: //retorna decimal
                    this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                    return parseFloat(izq) % parseFloat(der);
                default:
                    //si hay error al operar
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
            }
        }
        else if (numero == 3) {
            //boolean
            //si hay error al operar
            return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
        }
        else if (numero == 4) {
            //cadena
            //si hay error al operar
            return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
        }
        else if (numero == 5) {
            //caracter
            //si hay error al operar
            return new Errores_1.default('SEMANTICO', 'TIPO DE DATO NO PERMITIDO', this.fila, this.columna);
        }
    }
}
exports.default = Operacion;
var Operadores;
(function (Operadores) {
    Operadores[Operadores["SUMA"] = 0] = "SUMA";
    Operadores[Operadores["RESTA"] = 1] = "RESTA";
    Operadores[Operadores["MULTIPLICACION"] = 2] = "MULTIPLICACION";
    Operadores[Operadores["DIVISION"] = 3] = "DIVISION";
    Operadores[Operadores["POTENCIA"] = 4] = "POTENCIA";
    Operadores[Operadores["MODULADOR"] = 5] = "MODULADOR";
    Operadores[Operadores["MENOSNUM"] = 6] = "MENOSNUM";
})(Operadores = exports.Operadores || (exports.Operadores = {}));
