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
const Simbolo_TablaSimbolos_1 = __importDefault(require("../../OLC_Simb/Simbolo_TablaSimbolos"));
const Simbolo_Tipo_1 = __importStar(require("../../OLC_Simb/Simbolo_Tipo"));
const Instruccion_Return_1 = __importDefault(require("../Instruccion_Return"));
class condSwitchCase extends Instruccion_1.Instruccion {
    constructor(fila, columna, expresion, instrucciones) {
        super(new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO), fila, columna);
        this.expresion = expresion;
        this.instrucciones = instrucciones;
    }
    getNodo() {
        let nodo = new Nodo_AST_1.default('CASE');
        nodo.agregarHijo('case');
        nodo.agregarHijoAST(this.expresion.getNodo());
        nodo.agregarHijo(':');
        this.instrucciones.forEach((element) => {
            nodo.agregarHijoAST(element.getNodo());
        });
        return nodo;
    }
    interpretar(arbol, tabla) {
        var _a, _b;
        let val = this.expresion.interpretar(arbol, tabla);
        let valExpresion = (_a = this.expresionCase) === null || _a === void 0 ? void 0 : _a.interpretar(arbol, tabla);
        if (this.expresion.tipoDato.getTipo() ==
            ((_b = this.expresionCase) === null || _b === void 0 ? void 0 : _b.tipoDato.getTipo())) {
            if (val == valExpresion) {
                let nuevaTabla = new Simbolo_TablaSimbolos_1.default(tabla);
                nuevaTabla.setNombre('Case');
                for (let i = 0; i < this.instrucciones.length; i++) {
                    let a = this.instrucciones[i].interpretar(arbol, nuevaTabla);
                    if (a instanceof Errores_1.default) {
                        indexControllers_1.listaErrores.push(a);
                        arbol.actualizaConsola(a.returnError());
                    }
                    if (a instanceof Instruccion_Return_1.default)
                        return a;
                    if (a == 'ByLyContinue')
                        return a;
                    if (a == 'ByLy23')
                        return a;
                }
            }
        }
        else {
            return new Errores_1.default('SEMANTICO', 'VARIABLE  TIPOS DE DATOS DIFERENTES', this.fila, this.columna);
        }
    }
}
exports.default = condSwitchCase;
