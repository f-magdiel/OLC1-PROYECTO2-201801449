"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = exports.listaErrores = void 0;
const Nodo_AST_1 = __importDefault(require("./OLC_Abs/Nodo_AST"));
const Errores_1 = __importDefault(require("./OLC_Excep/Errores"));
const Instruccion_Asignacion_1 = __importDefault(require("./OLC_Instruc/Instruccion_Asignacion"));
const Instruccion_Declaracion_1 = __importDefault(require("./OLC_Instruc/Instruccion_Declaracion"));
const Instruccion_DeclaracionVectores_1 = __importDefault(require("./OLC_Instruc/Instruccion_DeclaracionVectores"));
const Instruccion_DeclaracionListas_1 = __importDefault(require("./OLC_Instruc/Instruccion_DeclaracionListas"));
const Instruccion_Run_1 = __importDefault(require("./OLC_Instruc/Instruccion_Run"));
const Instruccion_Funciones_1 = __importDefault(require("./OLC_Instruc/Instruccion_Funciones"));
const Instruccion_Metodos_1 = __importDefault(require("./OLC_Instruc/Instruccion_Metodos"));
const Simbolo_Arbol_1 = __importDefault(require("./OLC_Simb/Simbolo_Arbol"));
const Simbolo_TablaSimbolos_1 = __importDefault(require("./OLC_Simb/Simbolo_TablaSimbolos"));
const Reporte_Graficar_1 = __importDefault(require("./OLC_Rep/Reporte_Graficar"));
const Instruccion_AsignacionVector_1 = __importDefault(require("./OLC_Instruc/Instruccion_AsignacionVector"));
const Instruccion_AsignacionLista_1 = __importDefault(require("./OLC_Instruc/Instruccion_AsignacionLista"));
const Instruccion_AgregarLista_1 = __importDefault(require("./OLC_Instruc/Instruccion_AgregarLista"));
let tablaSym;
tablaSym = new Array();
let arbolNuevo;
let contador;
let cuerpo;
class IndexController {
    //metodo para analizar todo el codigo ingresado y responder con un respuesta
    //para realizar peticiones al backend
    interpretar(req, res) {
        exports.listaErrores = new Array();
        let parser = require('./OLC_Gramm/analizador');
        const { entrada } = req.body;
        const exp2 = req.body.exp;
        let ast = new Simbolo_Arbol_1.default(parser.parse(exp2));
        var tabla = new Simbolo_TablaSimbolos_1.default();
        ast.settablaGlobal(tabla);
        for (let i of ast.getinstrucciones()) {
            if (i instanceof Instruccion_Metodos_1.default || i instanceof Instruccion_Funciones_1.default) {
                ast.getfunciones().push(i);
            }
        }
        for (let i of ast.getinstrucciones()) {
            if (i instanceof Errores_1.default) {
                exports.listaErrores.push(i);
                ast.actualizaConsola(i.returnError());
            }
            if (i instanceof Instruccion_Metodos_1.default || i instanceof Instruccion_Funciones_1.default || i instanceof Instruccion_Run_1.default)
                continue;
            if (i instanceof Instruccion_Declaracion_1.default ||
                i instanceof Instruccion_Asignacion_1.default ||
                i instanceof Instruccion_DeclaracionVectores_1.default ||
                i instanceof Instruccion_DeclaracionListas_1.default ||
                i instanceof Instruccion_AsignacionVector_1.default ||
                i instanceof Instruccion_AsignacionLista_1.default ||
                i instanceof Instruccion_AgregarLista_1.default) {
                var resultador = i.interpretar(ast, tabla);
                if (resultador instanceof Errores_1.default) {
                    exports.listaErrores.push(resultador);
                    ast.actualizaConsola(resultador.returnError());
                }
            }
            else {
                let error = new Errores_1.default('SEMANTICO', 'SENTENCIA FUERA DE METODO', i.fila, i.columna);
                exports.listaErrores.push(error);
                ast.actualizaConsola(error.returnError());
            }
        }
        for (let i of ast.getinstrucciones()) {
            if (i instanceof Instruccion_Run_1.default) {
                var resultador = i.interpretar(ast, tabla);
                if (resultador instanceof Errores_1.default) {
                    exports.listaErrores.push(resultador);
                    ast.actualizaConsola(resultador.returnError());
                }
            }
        }
        arbolNuevo = ast;
        tablaSym.length = 0; // lo vacio
        for (let i of ast.getSimbolos()) {
            console.log("tabla");
            console.log(i);
            tablaSym.push(i);
        }
        // retorno el resultado, array de errores y de simbolos
        return res.send({
            resultado: ast.getconsola(),
            errores: exports.listaErrores,
            tabla: ast.getSimbolos(),
        });
    }
    //metodo para graficar cuando se hace la peticion desde el front
    graficar(req, res) {
        let otro = arbolNuevo;
        if (otro == null)
            return res.json({ msg: false });
        let arbolAst = new Nodo_AST_1.default('RAIZ');
        let nodoINS = new Nodo_AST_1.default('INSTRUCCIONES');
        otro.getinstrucciones().forEach((element) => {
            nodoINS.agregarHijoAST(element.getNodo());
        });
        arbolAst.agregarHijoAST(nodoINS);
        (0, Reporte_Graficar_1.default)(arbolAst);
        return res.json({ msg: true });
    }
    //metodo para deolver el array de errores cuando se hace la peticion desde el front
    consultaerror(req, res) {
        return res.send({
            errores: exports.listaErrores
        });
    }
    //meotodo para devolver el array de tabla de simbolos cuando se hace la peticion desde el front
    consultatabla(req, res) {
        return res.send({
            tabla: tablaSym
        });
    }
}
exports.indexController = new IndexController();
