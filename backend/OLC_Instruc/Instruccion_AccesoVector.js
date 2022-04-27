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
const Instruccion_1 = require("../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("../OLC_Excep/Errores"));
const Simbolo_Tipo_1 = __importStar(require("../OLC_Simb/Simbolo_Tipo"));
class accesoVector extends Instruccion_1.Instruccion {
    //el metodo constructor
    constructor(identificador, expresion, fila, columna) {
        super(new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO), fila, columna);
        this.identificador = identificador.toLowerCase();
        this.expresion = expresion;
    }
    //para analizar los valores ingresados
    interpretar(arbol, tabla) {
        let exp = this.expresion.interpretar(arbol, tabla);
        if (exp instanceof Errores_1.default)
            return exp;
        if (this.expresion.tipoDato.getTipo() != Simbolo_Tipo_1.tipoDato.ENTERO)
            return new Errores_1.default('SEMANTICO', 'TIPO DE DATO DIFERENTE', this.fila, this.columna);
        let ide = tabla.getVariable(this.identificador);
        if (ide != null) {
            this.tipoDato = new Simbolo_Tipo_1.default(ide.gettipo().getTipo());
            return ide.getvalor()[exp];
        }
        return null;
    }
    //para obtener nodo
    getNodo() {
        let nodo = new Nodo_AST_1.default('ACCESO-VECTOR');
        nodo.agregarHijo(this.identificador);
        nodo.agregarHijo('[');
        nodo.agregarHijoAST(this.expresion.getNodo());
        nodo.agregarHijo(']');
        return nodo;
    }
}
exports.default = accesoVector;
