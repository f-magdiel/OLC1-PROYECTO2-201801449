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
const indexControllers_1 = require("../../indexControllers");
const Instruccion_1 = require("../../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../../OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("../../OLC_Excep/Errores"));
const Simbolo_Tipo_1 = __importStar(require("../../OLC_Simb/Simbolo_Tipo"));
const Instruccion_Return_1 = __importDefault(require("../Instruccion_Return"));
class condSwitch extends Instruccion_1.Instruccion {
    constructor(fila, columna, expresion, listaCasos, defecto) {
        super(new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO), fila, columna);
        this.expresion = expresion;
        this.listaCasos = listaCasos;
        this.defecto = defecto;
    }
    getNodo() {
        let nodo = new Nodo_AST_1.default('SWITCH');
        nodo.agregarHijo('switch');
        nodo.agregarHijo('(');
        nodo.agregarHijoAST(this.expresion.getNodo());
        nodo.agregarHijo(')');
        nodo.agregarHijo('{');
        if (this.listaCasos != undefined) {
            this.listaCasos.forEach((element) => {
                nodo.agregarHijoAST(element.getNodo());
            });
        }
        if (this.defecto != undefined) {
            nodo.agregarHijoAST(this.defecto.getNodo());
        }
        nodo.agregarHijo('}');
        return nodo;
    }
    interpretar(arbol, tabla) {
        if (this.listaCasos != undefined) {
            for (let caso of this.listaCasos) {
                caso.expresionCase = this.expresion;
                let a = caso.interpretar(arbol, tabla);
                if (a instanceof Errores_1.default) {
                    indexControllers_1.listaErrores.push(a);
                    arbol.actualizaConsola(a.returnError());
                }
                if (a instanceof Instruccion_Return_1.default)
                    return a;
                if (a == 'ByLyContinue') {
                    indexControllers_1.listaErrores.push(new Errores_1.default('SEMANTICO', 'CONTINUE FUERA DE CICLO', this.fila, this.columna));
                    arbol.actualizaConsola(a.returnError());
                }
                if (a == 'ByLy23')
                    return;
            }
        }
        if (this.defecto != undefined) {
            let a = this.defecto.interpretar(arbol, tabla);
            if (a instanceof Errores_1.default) {
                indexControllers_1.listaErrores.push(a);
                arbol.actualizaConsola(a.returnError());
            }
            if (a instanceof Instruccion_Return_1.default)
                return a;
            if (a == 'ByLyContinue') {
                indexControllers_1.listaErrores.push(new Errores_1.default('SEMANTICO', 'CONTINUE FUERA DE CICLO', this.fila, this.columna));
                arbol.actualizaConsola(a.returnError());
            }
            if (a == 'ByLy23')
                return;
        }
    }
}
exports.default = condSwitch;
