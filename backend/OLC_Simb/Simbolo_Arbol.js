"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Simbolo_TablaSimbolos_1 = __importDefault(require("./Simbolo_TablaSimbolos"));
const Instruccion_Metodos_1 = __importDefault(require("../OLC_Instruc/Instruccion_Metodos"));
const Instruccion_Funciones_1 = __importDefault(require("../OLC_Instruc/Instruccion_Funciones"));
const Reporte_ReporteTabla_1 = require("../OLC_Rep/Reporte_ReporteTabla");
const Reporte_CambiarTipo_1 = __importDefault(require("../OLC_Rep/Reporte_CambiarTipo"));
class Arbol {
    //el metodo constructor
    constructor(instrucciones) {
        this.consola = '';
        this.instrucciones = instrucciones;
        this.consola = '';
        this.tablaGlobal = new Simbolo_TablaSimbolos_1.default();
        this.errores = new Array();
        this.funciones = new Array();
        this.listaSimbolos = new Array();
    }
    //metodo para actualizar la tabla de simbolos
    actualizarTabla(identificador, valor, linea, entorno, columna) {
        for (var elemento of this.listaSimbolos) {
            if (elemento.getIdentificador().toString() == identificador.toLowerCase() &&
                elemento.getEntorno().toString() == entorno.toString()) {
                elemento.setValor(valor);
                elemento.setLinea(linea);
                elemento.setColumna(columna);
                return true;
            }
        }
        return false;
    }
    //metodo para buscar el tipo de datos
    BuscarTipo(identificador) {
        for (var elemento of this.listaSimbolos) {
            if (elemento.getIdentificador() == identificador.toLowerCase()) {
                return elemento.getForma().toString();
            }
        }
        return 'as';
    }
    //metodo para obtener nombre funcion
    getFuncion(identificador) {
        for (let f of this.funciones) {
            if (f instanceof Instruccion_Metodos_1.default) {
                if (identificador.toLowerCase() ==
                    f.identificador.toLowerCase()) {
                    if (!this.actualizarTabla(f.identificador.toString(), '', f.fila.toString(), '', f.columna.toString())) {
                        let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(f.identificador, '', 'MetodoCreacion', 'void', '', f.fila.toString(), f.columna.toString());
                        this.listaSimbolos.push(nuevoSimbolo);
                    }
                    return f;
                }
            }
            else if (f instanceof Instruccion_Funciones_1.default) {
                if (identificador.toLowerCase() ==
                    f.identificador.toLowerCase()) {
                    if (!this.actualizarTabla(f.identificador.toString(), '', f.fila.toString(), '', f.columna.toString())) {
                        let nuevoSimbolo = new Reporte_ReporteTabla_1.reporteTabla(f.identificador, '', 'FuncionCreacion', (0, Reporte_CambiarTipo_1.default)(f.tipoDato.getTipo()) + '', '', f.fila.toString(), f.columna.toString());
                        this.listaSimbolos.push(nuevoSimbolo);
                    }
                    return f;
                }
            }
        }
    }
    //metodos para obtener los arrays
    //metodo para obtener el arrya de simbolos
    getSimbolos() {
        return this.listaSimbolos;
    }
    getfunciones() {
        return this.funciones;
    }
    setfunciones(value) {
        this.funciones = value;
    }
    geterrores() {
        return this.errores;
    }
    seterrores(value) {
        this.errores = value;
    }
    getinstrucciones() {
        return this.instrucciones;
    }
    setinstrucciones(value) {
        this.instrucciones = value;
    }
    getconsola() {
        return this.consola;
    }
    setconsola(value) {
        this.consola = value;
    }
    actualizaConsola(uptodate) {
        this.consola = `${this.consola}${uptodate}\n`;
    }
    actualizaConsolaL2(uptodate) {
        this.consola = `${this.consola}${uptodate} `;
    }
    gettablaGlobal() {
        return this.tablaGlobal;
    }
    settablaGlobal(value) {
        this.tablaGlobal = value;
    }
}
exports.default = Arbol;
