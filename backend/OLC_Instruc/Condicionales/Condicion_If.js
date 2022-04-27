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
class condIf extends Instruccion_1.Instruccion {
    constructor(fila, columna, cond1, condIf, condElse, condElseIf) {
        super(new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO), fila, columna);
        this.cond1 = cond1;
        this.condIf = condIf;
        this.condElse = condElse;
        this.condElseIf = condElseIf;
    }
    getNodo() {
        let nodo = new Nodo_AST_1.default('IF');
        nodo.agregarHijo('if');
        nodo.agregarHijo('(');
        nodo.agregarHijoAST(this.cond1.getNodo());
        nodo.agregarHijo(')');
        nodo.agregarHijo('{');
        this.condIf.forEach((element) => {
            nodo.agregarHijoAST(element.getNodo());
        });
        nodo.agregarHijo('}');
        if (this.condElse != undefined) {
            nodo.agregarHijo('else');
            nodo.agregarHijo('{');
            this.condElse.forEach((element) => {
                nodo.agregarHijoAST(element.getNodo());
            });
            nodo.agregarHijo('}');
        }
        if (this.condElseIf != undefined) {
            nodo.agregarHijo('else');
            nodo.agregarHijo('if');
            nodo.agregarHijo('{');
            nodo.agregarHijoAST(this.condElseIf.getNodo());
            nodo.agregarHijo('}');
        }
        return nodo;
    }
    interpretar(arbol, tabla) {
        let val = this.cond1.interpretar(arbol, tabla);
        if (this.cond1.tipoDato.getTipo() != Simbolo_Tipo_1.tipoDato.BOOLEANO) {
            return new Errores_1.default('SEMANTICO', 'DATO DEBE SER BOOLEANO', this.fila, this.columna);
        }
        if (val) {
            let nuevaTabla = new Simbolo_TablaSimbolos_1.default(tabla);
            nuevaTabla.setNombre('If');
            for (let i = 0; i < this.condIf.length; i++) {
                let a = this.condIf[i].interpretar(arbol, nuevaTabla);
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
        else {
            if (this.condElse != undefined) {
                let nuevaTabla = new Simbolo_TablaSimbolos_1.default(tabla);
                nuevaTabla.setNombre('else');
                for (let i = 0; i < this.condElse.length; i++) {
                    let a = this.condElse[i].interpretar(arbol, nuevaTabla);
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
            else if (this.condElseIf != undefined) {
                let b = this.condElseIf.interpretar(arbol, tabla);
                if (b instanceof Errores_1.default)
                    return b;
                if (b instanceof Instruccion_Return_1.default)
                    return b;
                if (b == 'ByLyContinue')
                    return b;
                if (b == 'ByLy23')
                    return b;
            }
        }
    }
}
exports.default = condIf;
