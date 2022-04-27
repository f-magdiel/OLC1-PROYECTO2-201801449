/*const indexP = __importDefault(require("./indexControllers"));
let Errores = require('./Excepciones/Errores');
let listaErrores = new Array<Errores>('','',0,0);

let parser = require('./grammar/analizador');
let a1="int a=5; \n int b=10; \n"
let b1="exec InicioArchivo1();\n"
let b3="void InicioArchivo1() { \n int suma=a+b; \n print(suma);\n}"
let final=a1+b1+b3
console.log(final)
let ast = new Arbol(parser.parse(final));
var tabla = new tablaSimbolos();*/
const cors = require('cors')
const express = require('express')
const par2 = require('./indexControllers')

const app = express()
app.use(cors())
app.use(express.json())
const PORT = 5000


//ENDOPINT DEL SERVIDOR
app.post('/Interpretar',(req,res) => {
    const exp=req.body.exp
    //console.log(exp)
    par2.indexController.interpretar(req,res)  
})

app.get('/graficarast',(req,res) => {
    const exp=req.body.exp
    par2.indexController.graficar(req,res)
})

app.get('/consultaerror',(req,res) => {
    par2.indexController.consultaerror(req,res)
})

app.get('/consultatable',(req,res) => {
    par2.indexController.consultatabla(req,res)
})

app.listen(PORT,() => console.log('Server running on port: '+ PORT))
//******************************************** */


