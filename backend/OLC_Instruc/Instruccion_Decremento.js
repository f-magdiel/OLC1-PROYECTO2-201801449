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
const Identificador_1 = __importDefault(require("../OLC_Exp/Identificador"));
const Simbolo_Tipo_1 = __importStar(require("../OLC_Simb/Simbolo_Tipo"));
class Incremento extends Instruccion_1.Instruccion {
    //el metodo constructor
    constructor(identificador, fila, columna) {
        super(new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO), fila, columna);
        this.identificador = identificador;
    }
    //metodo para analizar los valores ingresados
    interpretar(arbol, tabla) {
        if (this.identificador instanceof Identificador_1.default) {
            let variable = tabla.getVariable(this.identificador.identificador);
            if (variable != null) {
                if (variable.gettipo().getTipo() == Simbolo_Tipo_1.tipoDato.ENTERO ||
                    variable.gettipo().getTipo() == Simbolo_Tipo_1.tipoDato.DECIMAL) {
                    this.tipoDato.setTipo(variable.gettipo().getTipo());
                    let uno = variable.getvalor();
                    uno--;
                    variable.setvalor(uno);
                }
                else {
                    return new Errores_1.default('SEMANTICO', 'VARIABLE ' + this.identificador + ' DEBE SER VALOR NUMERICO', this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.default('SEMANTICO', 'VARIABLE ' + this.identificador + ' NO EXISTE', this.fila, this.columna);
            }
        }
        else {
            let valE = this.identificador.interpretar(arbol, tabla);
            if (valE instanceof Errores_1.default)
                return valE;
            if (this.identificador.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.ENTERO) {
                this.tipoDato.setTipo(Simbolo_Tipo_1.tipoDato.ENTERO);
                let otro = parseInt(valE);
                otro--;
                return otro;
            }
            else if (this.identificador.tipoDato.getTipo() == Simbolo_Tipo_1.tipoDato.DECIMAL) {
                this.tipoDato.setTipo(Simbolo_Tipo_1.tipoDato.DECIMAL);
                let otro = parseFloat(valE);
                otro--;
                return otro;
            }
            else {
                return new Errores_1.default('SEMANTICO', 'VARIABLE ' + this.identificador + ' DEBE SER VALOR NUMERICO', this.fila, this.columna);
            }
        }
    }
    //metodo para obtener un Nodo
    getNodo() {
        let nodo = new Nodo_AST_1.default('DECREMENTO');
        nodo.agregarHijoAST(this.identificador.getNodo());
        nodo.agregarHijo('-');
        nodo.agregarHijo('-');
        return nodo;
    }
}
exports.default = Incremento;
