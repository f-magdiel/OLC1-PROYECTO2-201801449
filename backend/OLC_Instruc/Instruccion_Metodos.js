"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Reporte_CambiarTipo_1 = __importDefault(require("../OLC_Rep/Reporte_CambiarTipo"));
const Instruccion_1 = require("../OLC_Abs/Instruccion");
const Nodo_AST_1 = __importDefault(require("../OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("../OLC_Excep/Errores"));
const Instruccion_Return_1 = __importDefault(require("./Instruccion_Return"));
class Metodos extends Instruccion_1.Instruccion {
    //el metodo constructor
    constructor(tipo, fila, columna, identificador, parametros, instrucciones) {
        super(tipo, fila, columna);
        this.identificador = identificador.toLowerCase();
        this.parametros = parametros;
        this.instrucciones = instrucciones;
    }
    //metodo para analizar los valores ingresados
    interpretar(arbol, tabla) {
        for (let i = 0; i < this.instrucciones.length; i++) {
            let val = this.instrucciones[i].interpretar(arbol, tabla);
            if (val instanceof Errores_1.default)
                return val;
            if (this.instrucciones[i] instanceof Instruccion_Return_1.default) {
                if (val instanceof Instruccion_Return_1.default) {
                    if (val.valor != null) {
                        return new Errores_1.default('SEMANTICO', 'NO PUEDE DEVOLVER UN VALOR EN UN METODO', this.fila, this.columna);
                    }
                    else
                        break;
                }
                else
                    return new Errores_1.default('SEMANTICO', 'NO PUEDE DEVOLVER UN VALOR EN UN METODO', this.fila, this.columna);
            }
        }
    }
    //metodo para obtener nodo
    getNodo() {
        let nodo = new Nodo_AST_1.default('METODO');
        nodo.agregarHijo(this.identificador + '');
        nodo.agregarHijo('(');
        let nuevo = null;
        if (this.parametros.length > 0) {
            nuevo = new Nodo_AST_1.default('PARAMETROS'); //para recibir los parametros 
        }
        for (let param = 0; param < this.parametros.length; param++) {
            if (nuevo == null)
                break;
            let vari = (0, Reporte_CambiarTipo_1.default)(this.parametros[param].tipato.getTipo());
            let ide = this.parametros[param].identificador;
            if (vari != null)
                nuevo.agregarHijo(vari);
            if (ide != null)
                nuevo.agregarHijo(ide);
            if (param != this.parametros.length - 1)
                nuevo.agregarHijo(',');
        }
        if (nuevo != null)
            nodo.agregarHijoAST(nuevo);
        nodo.agregarHijo(')');
        nodo.agregarHijo(':');
        nodo.agregarHijo('void');
        nodo.agregarHijo('{');
        this.instrucciones.forEach((element) => {
            nodo.agregarHijoAST(element.getNodo());
        });
        nodo.agregarHijo('}');
        return nodo;
    }
}
exports.default = Metodos;
