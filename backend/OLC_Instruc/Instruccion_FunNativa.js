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
const Reporte_CambiarTipo_1 = __importDefault(require("../OLC_Rep/Reporte_CambiarTipo"));
const Instruccion_1 = require("../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("../OLC_Excep/Errores"));
const Identificador_1 = __importDefault(require("../OLC_Exp/Identificador"));
const Simbolo_Tipo_1 = __importStar(require("../OLC_Simb/Simbolo_Tipo"));
class funcNativa extends Instruccion_1.Instruccion {
    //el metodo constructor
    constructor(identificador, expresion, fila, columna) {
        super(new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO), fila, columna);
        this.identificador = identificador.toLowerCase();
        this.expresion = expresion;
        if (expresion instanceof Identificador_1.default)
            this.ide = expresion.identificador.toString();
        else
            this.ide = '';
    }
    //para analizar los valores ingresados
    interpretar(arbol, tabla) {
        let exp = this.expresion.interpretar(arbol, tabla);
        if (exp instanceof Errores_1.default)
            return exp;
        switch (this.identificador) {
            case 'tolower':
                if (this.expresion.tipoDato.getTipo() != Simbolo_Tipo_1.tipoDato.CADENA)
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO INCOMPATIBLE CON FUNCION TOLOWER', this.fila, this.columna);
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                return exp.toString().toLowerCase();
            case 'toupper':
                if (this.expresion.tipoDato.getTipo() != Simbolo_Tipo_1.tipoDato.CADENA)
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO INCOMPATIBLE CON FUNCION TOUPPER', this.fila, this.columna);
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                return exp.toString().toUpperCase();
            case 'length':
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                let vec = arbol.BuscarTipo(this.ide);
                if (vec == 'lista' || vec == 'vector')
                    return exp.length;
                else if (this.expresion.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.CADENA)
                    return exp.length;
                else
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO INCOMPATIBLE CON FUNCION LENGTH', this.fila, this.columna);
            case 'truncate':
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                if (this.expresion.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.DECIMAL ||
                    this.expresion.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.ENTERO)
                    return Math.trunc(parseFloat(exp));
                else
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO INCOMPATIBLE CON FUNCION TRUNCATE', this.fila, this.columna);
            case 'round':
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                if (this.expresion.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.DECIMAL ||
                    this.expresion.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.ENTERO)
                    return Math.round(parseFloat(exp));
                else
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO INCOMPATIBLE CON FUNCION ROUND', this.fila, this.columna);
            case 'typeof':
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                let tipo = arbol.BuscarTipo(this.ide);
                if (tipo == 'lista' || tipo == 'vector')
                    return tipo.toString();
                else
                    return (0, Reporte_CambiarTipo_1.default)(this.expresion.tipoDato.getTipo());
            case 'tostring':
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                if (this.expresion.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.DECIMAL ||
                    this.expresion.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.ENTERO ||
                    this.expresion.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.BOOLEANO ||
                    this.expresion.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.CARACTER)
                    return exp.toString();
                else
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO INCOMPATIBLE CON FUNCION TOSTRING', this.fila, this.columna);
            case 'tochararray':
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CARACTER);
                if (this.expresion.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.CADENA) {
                    let arreglo = [];
                    let cadena = exp.toString();
                    for (let i = 0; i < cadena.length; i++) {
                        arreglo.push(cadena[i]);
                    }
                    return arreglo;
                }
                else
                    return new Errores_1.default('SEMANTICO', 'TIPO DE DATO INCOMPATIBLE CON FUNCION TOCHARARRAY', this.fila, this.columna);
            default:
                return new Errores_1.default('SEMANTICO', 'TIPO DE DATO INCOMPATIBLE CON FUNCION NATIVA', this.fila, this.columna);
        }
    }
    //para obtener Nodo
    getNodo() {
        let nodo = new Nodo_AST_1.default('FUNCION-NATIVA');
        nodo.agregarHijo(this.identificador);
        nodo.agregarHijo('(');
        nodo.agregarHijoAST(this.expresion.getNodo());
        nodo.agregarHijo(')');
        return nodo;
    }
}
exports.default = funcNativa;
