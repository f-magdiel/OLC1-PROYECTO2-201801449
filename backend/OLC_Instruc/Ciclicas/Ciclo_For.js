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
class condFor extends Instruccion_1.Instruccion {
    //el metodo constructor
    constructor(declasignacion, condicion, actualizacion, instrucciones, fila, columna) {
        super(new Simbolo_Tipo_1.default(Simbolo_Tipo_1.tipoDato.ENTERO), fila, columna);
        this.Asignacion = declasignacion;
        this.actualizacion = actualizacion;
        this.condicion = condicion;
        this.instrucciones = instrucciones;
    }
    //analizar valor ingresado
    interpretar(arbol, tabla) {
        let nuevaTabla = new Simbolo_TablaSimbolos_1.default(tabla);
        nuevaTabla.setNombre('For');
        let declaAsig = this.Asignacion.interpretar(arbol, nuevaTabla);
        if (declaAsig instanceof Errores_1.default)
            return declaAsig;
        let val = this.condicion.interpretar(arbol, nuevaTabla);
        if (val instanceof Errores_1.default)
            return val;
        if (this.condicion.tipoDato.getTipo() != Simbolo_Tipo_1.tipoDato.BOOLEANO) {
            return new Errores_1.default('SEMANTICO', 'DATO DEBE SER BOOLEANO', this.fila, this.columna);
        }
        while (this.condicion.interpretar(arbol, nuevaTabla)) {
            let otraTabla = new Simbolo_TablaSimbolos_1.default(nuevaTabla);
            otraTabla.setNombre('ForDentro');
            for (let i = 0; i < this.instrucciones.length; i++) {
                let a = this.instrucciones[i].interpretar(arbol, otraTabla);
                if (a instanceof Errores_1.default) {
                    indexControllers_1.listaErrores.push(a);
                    arbol.actualizaConsola(a.returnError());
                }
                if (a instanceof Instruccion_Return_1.default)
                    return a;
                if (a == 'ByLyContinue')
                    break;
                if (a == 'ByLy23')
                    return;
            }
            let valActualizacion = this.actualizacion.interpretar(arbol, nuevaTabla);
            if (valActualizacion instanceof Errores_1.default)
                return valActualizacion;
        }
    }
    //para obtener nodo
    getNodo() {
        let nodo = new Nodo_AST_1.default('FOR');
        nodo.agregarHijo('for');
        nodo.agregarHijo('(');
        nodo.agregarHijoAST(this.Asignacion.getNodo());
        nodo.agregarHijo(';');
        nodo.agregarHijoAST(this.condicion.getNodo());
        nodo.agregarHijo(';');
        nodo.agregarHijoAST(this.actualizacion.getNodo());
        nodo.agregarHijo(')');
        nodo.agregarHijo('{');
        this.instrucciones.forEach((element) => {
            nodo.agregarHijoAST(element.getNodo());
        });
        nodo.agregarHijo('}');
        return nodo;
    }
}
exports.default = condFor;
