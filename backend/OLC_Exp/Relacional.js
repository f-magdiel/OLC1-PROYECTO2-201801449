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
exports.Relacionales = void 0;
const Instruccion_1 = require("../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("../OLC_Excep/Errores"));
const Simbolo_Tipo_1 = __importStar(require("../OLC_Simb/Simbolo_Tipo"));
class Relacional extends Instruccion_1.Instruccion {
    //el metodo constructor
    constructor(relacion, fila, columna, Instruc1, Instruc2) {
        super(new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO), fila, columna);
        this.relacion = relacion;
        this.Instruc1 = Instruc1;
        this.Instruc2 = Instruc2;
    }
    //para analizar el valor ingresado
    interpretar(arbol, tabla) {
        let izq, der;
        izq = this.obtieneValor(this.Instruc1, arbol, tabla);
        if (izq instanceof Errores_1.default)
            return izq;
        der = this.obtieneValor(this.Instruc2, arbol, tabla);
        if (der instanceof Errores_1.default)
            return der;
        if (this.Instruc1.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.CADENA &&
            this.Instruc2.tipoDato.getTipo() != Simbolo_Tipo_1.tipoDato.CADENA) {
            return new Errores_1.default('ERROR SEMANTICO', 'NO SE PUEDE COMPARAR UNA CADENA CON OTRO TIPO DE DATO QUE NO SEA CADENA', this.fila, this.columna);
        }
        else if (this.Instruc2.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.CADENA &&
            this.Instruc1.tipoDato.getTipo() != Simbolo_Tipo_1.tipoDato.CADENA) {
            return new Errores_1.default('ERROR SEMANTICO', 'NO SE PUEDE COMPARAR UNA CADENA CON OTRO TIPO DE DATO QUE NO SEA CADENA', this.fila, this.columna);
        }
        else {
            this.tipoDato.setTipo(Simbolo_Tipo_1.tipoDato.BOOLEANO);
            switch (this.relacion) {
                case Relacionales.IGUAL:
                    return izq == der;
                case Relacionales.DIFERENTE:
                    return izq != der;
                case Relacionales.MENOR:
                    return izq < der;
                case Relacionales.MENORIGUAL:
                    return izq <= der;
                case Relacionales.MAYOR:
                    return izq > der;
                case Relacionales.MAYORIGUAL:
                    return izq >= der;
                default:
                    return 'what';
            }
        }
    }
    //para obtner un valor en el arbol
    obtieneValor(operando, arbol, tabla) {
        let valor = operando.interpretar(arbol, tabla);
        switch (operando.tipoDato.getTipo()) {
            case Simbolo_Tipo_1.tipoDato.ENTERO:
                return parseInt(valor);
            case Simbolo_Tipo_1.tipoDato.DECIMAL:
                return parseFloat(valor);
            case Simbolo_Tipo_1.tipoDato.CARACTER:
                var da = valor + '';
                var res = da.charCodeAt(0);
                return res;
            case Simbolo_Tipo_1.tipoDato.BOOLEANO:
                let dats = valor + '';
                let otr = dats.toLowerCase();
                return parseInt(otr);
            case Simbolo_Tipo_1.tipoDato.CADENA:
                return '' + valor;
        }
    }
    //para obtener un nodo
    getNodo() {
        let nodo = new Nodo_AST_1.default('RELACIONAL');
        nodo.agregarHijoAST(this.Instruc1.getNodo());
        nodo.agregarHijo(this.relacion + '', 'rel', this.relacion);
        nodo.agregarHijoAST(this.Instruc2.getNodo());
        return nodo;
    }
}
exports.default = Relacional;
var Relacionales;
(function (Relacionales) {
    Relacionales[Relacionales["IGUAL"] = 0] = "IGUAL";
    Relacionales[Relacionales["DIFERENTE"] = 1] = "DIFERENTE";
    Relacionales[Relacionales["MAYOR"] = 2] = "MAYOR";
    Relacionales[Relacionales["MENOR"] = 3] = "MENOR";
    Relacionales[Relacionales["MAYORIGUAL"] = 4] = "MAYORIGUAL";
    Relacionales[Relacionales["MENORIGUAL"] = 5] = "MENORIGUAL";
})(Relacionales = exports.Relacionales || (exports.Relacionales = {}));
