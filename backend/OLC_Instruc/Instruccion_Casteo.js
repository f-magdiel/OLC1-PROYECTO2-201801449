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
const Reporte_CambiarTipo_1 = __importDefault(require("../OLC_Rep/Reporte_CambiarTipo")); //si usa lo de reportes
const Instruccion_1 = require("../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("../OLC_Excep/Errores"));
const Simbolo_Tipo_1 = __importStar(require("../OLC_Simb/Simbolo_Tipo"));
class casteo extends Instruccion_1.Instruccion {
    //el metodo constructor
    constructor(tipo, expresion, fila, columna) {
        super(tipo, fila, columna);
        this.tipo = tipo;
        this.expresion = expresion;
    }
    //metodo para analizar los valores ingresados
    interpretar(arbol, tabla) {
        let exp = this.expresion.interpretar(arbol, tabla);
        if (exp instanceof Errores_1.default)
            return exp;
        if (this.expresion.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.ENTERO) {
            if (this.tipo.getTipo() == Simbolo_Tipo_1.tipoDato.DECIMAL) {
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                return parseFloat(exp);
            }
            else if (this.tipo.getTipo() == Simbolo_Tipo_1.tipoDato.CADENA) {
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                return exp.toString();
            }
            else if (this.tipo.getTipo() == Simbolo_Tipo_1.tipoDato.CARACTER) {
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CARACTER);
                return String.fromCharCode(parseInt(exp));
            }
            else
                return new Errores_1.default('SEMANTICO', 'NO ES POSIBLE EL CASTEO POR TIPO DE DATO', this.fila, this.columna);
        }
        else if (this.expresion.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.DECIMAL) {
            if (this.tipo.getTipo() == Simbolo_Tipo_1.tipoDato.ENTERO) {
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                return parseInt(exp);
            }
            else if (this.tipo.getTipo() == Simbolo_Tipo_1.tipoDato.CADENA) {
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.CADENA);
                return exp.toString();
            }
            else
                return new Errores_1.default('SEMANTICO', 'NO ES POSIBLE EL CASTEO POR TIPO DE DATO', this.fila, this.columna);
        }
        else if (this.expresion.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.CARACTER) {
            if (this.tipo.getTipo() == Simbolo_Tipo_1.tipoDato.ENTERO) {
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO);
                var da = exp + '';
                var res = da.charCodeAt(0);
                return res;
            }
            else if (this.tipo.getTipo() == Simbolo_Tipo_1.tipoDato.DECIMAL) {
                this.tipoDato = new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.DECIMAL);
                var da = exp + '';
                var res = da.charCodeAt(0);
                return res;
            }
            else
                return new Errores_1.default('SEMANTICO', 'NO ES POSIBLE EL CASTEO POR TIPO DE DATO', this.fila, this.columna);
        }
        else
            return new Errores_1.default('SEMANTICO', 'NO ES POSIBLE EL CASTEO POR TIPO DE DATO', this.fila, this.columna);
    }
    //metodo para obtener nodo
    getNodo() {
        let nodo = new Nodo_AST_1.default('CASTEO');
        nodo.agregarHijo('(');
        nodo.agregarHijo((0, Reporte_CambiarTipo_1.default)(this.tipo.getTipo()) + '');
        nodo.agregarHijo(')');
        nodo.agregarHijoAST(this.expresion.getNodo());
        return nodo;
    }
}
exports.default = casteo;
