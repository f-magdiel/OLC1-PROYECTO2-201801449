%{
//codigo js
const println=require('../OLC_Instruc/Instruccion_Println');
const print=require('../OLC_Instruc/Instruccion_Print');
const nativo= require('../OLC_Exp/Nativo');
const errores= require('../OLC_Excep/Errores');
const inicio= require('../indexControllers');///AQUI HAY QUE TENER CUIDADO
const aritmeticas= require('../OLC_Exp/Operacion');
const Tipo= require('../OLC_Simb/Simbolo_Tipo');
const logicas= require("../OLC_Exp/Logica");
const relacional= require("../OLC_Exp/Relacional");
const declaracion= require("../OLC_Instruc/Instruccion_Declaracion");
const identificador=require("../OLC_Exp/Identificador");
const asignacion= require("../OLC_Instruc/Instruccion_Asignacion");
const condIf= require("../OLC_Instruc/Condicionales/Condicion_If");
const condWhile= require("../OLC_Instruc/Ciclicas/Ciclo_While");
const condDoWhile = require("../OLC_Instruc/Ciclicas/Ciclo_DoWhile");
const condTernario= require("../OLC_Instruc/Condicionales/Condicion_IfTernario");
const condBreak= require("../OLC_Instruc/Instruccion_Break");
const condContinue= require("../OLC_Instruc/Instruccion_Continue");
const condReturn= require("../OLC_Instruc/Instruccion_Return");
const condSwitch= require("../OLC_Instruc/Condicionales/Condicion_Switch");
const condDefault= require("../OLC_Instruc/Condicionales/Condicion_SwitchDefault");
const condCase= require("../OLC_Instruc/Condicionales/Condicion_SwitchCase");
const Incremento= require("../OLC_Instruc/Instruccion_Incremento");
const Decremento= require("../OLC_Instruc/Instruccion_Decremento");
const condFor= require("../OLC_Instruc/Ciclicas/Ciclo_For");
const metodos= require("../OLC_Instruc/Instruccion_Metodos");
const llamadas= require("../OLC_Instruc/Instruccion_LlamadaFunMetod");
const ejecucion= require("../OLC_Instruc/Instruccion_Run");
const funciones= require("../OLC_Instruc/Instruccion_Funciones");
const vectores=require('../OLC_Instruc/Instruccion_DeclaracionVectores');
const accesoVector= require('../OLC_Instruc/Instruccion_AccesoVector');
const modiVector = require('../OLC_Instruc/Instruccion_AsignacionVector');
const listas = require('../OLC_Instruc/Instruccion_DeclaracionListas');
const accesoLista = require('../OLC_Instruc/Instruccion_AccesoLista');
const modiLista = require('../OLC_Instruc/Instruccion_AsignacionLista');
const agregarLista= require('../OLC_Instruc/Instruccion_AgregarLista');
const funcNativa= require('../OLC_Instruc/Instruccion_FunNativa');
const casteo= require('../OLC_Instruc/Instruccion_Casteo');
%}
//definicion lexica
%lex 


%options case-insensitive
//inicio analisis lexico
%%
[ \r\t]+ {}
\n+ {}
"//".* {}  //comentario simple
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] {} //comentario multiple
//reservadas
"if"            return 'RESIF';
"else"          return 'RESELSE';
"print"         return 'RESPRINT';
"println"       return 'RESPRINTLN';
"int"           return 'RESINT';
"char"          return 'RESCHAR';
"double"        return 'RESDOUBLE';
"boolean"       return 'RESBOOL';
"string"        return 'RESSTRING';
"while"         return 'RESWHILE';
"do"            return 'RESDO';
"break"         return 'RESBREAK';
"continue"      return 'RESCONTINUE';
"return"        return 'RESRETURN';
"switch"        return 'RESSWITCH';
"case"          return 'RESCASE';
"default"       return 'RESDEFAULT';
"for"           return 'RESFOR';
"void"          return 'RESVOID';
"run"          return 'RESEXEC';//run HAY QUE HACER UN CAMBIO AQUI YA QUE SE USARA RUN
"new"           return 'RESNUEVO';
"list"          return 'RESLIST';
"add"           return 'RESADD';
"tolower"       return 'RESLOW';
"toupper"       return 'RESUP';
"length"        return 'RESLENG';
"truncate"      return 'RESTRUN';
"round"         return 'RESROUND';
"typeof"        return 'RESTYPE';
"tostring"      return 'RESTOSTR';
"tochararray"   return 'RESTOCHRARR';
//simbolos
"{"             return 'LLAVEABRE';
","             return 'COMA';
"}"             return 'LLAVECIERRA';
"||"            return 'OR';
"&&"            return 'AND';
";"             return 'PTCOMA';
"("             return 'PARABRE';
")"             return 'PARCIERRA';
"["             return 'CORCHABRE';
"]"             return 'CORCHCIERRA';
"+"             return 'MAS';
"-"             return 'MENOS';
"/"             return 'DIVI';
"*"             return 'POR';
"%"             return 'MOD';
"^"             return 'POTENCIA';
"=="            return 'COMPARACION';
"<="            return 'MENORIGUAL';
">="            return 'MAYORIGUAL';
"="             return 'IGUAL';
"!="            return 'DIFERENTE';
"!"             return 'NOT';
"<"             return 'MENOR';
">"             return 'MAYOR';
"?"             return 'INTERROGACION';
":"             return 'DOSPUNTOS';
"."             return 'PUNTO';
//expresiones regulares

//espacios en blanco
//cadena
\"[^\"]*\"             { yytext=yytext.substr(1,yyleng-2); return 'CADENA'; }
[0-9]+("."[0-9]+)\b     return 'DECIMAL';
[0-9]+\b                return 'ENTERO';
\'[^\']\'               return 'CARACTER';
("true"|"false")\b      return 'BOOLEANO';
([a-zA-Z])[a-zA-Z0-9_]* return 'IDENTIFICADOR';

<<EOF>>                 return 'EOF';


.                        {inicio.listaErrores.push(new errores.default('ERROR LEXICO',yytext,this._$.first_line,this._$.first_column)); console.log("lexi "+yytext);}

/lex
//Precedencia
%left 'INTERROGACION' 
%left 'DOSPUNTOS'
%left 'OR'
%left 'AND'
%left 'NOT'
%left 'MAYOR' 'MENOR' 'MAYORIGUAL' 'MENORIGUAL' 'COMPARACION' 'DIFERENTE'
%left 'MAS' 'MENOS'
%left 'POR' 'DIVI' 'MOD'
%right 'POTENCIA'
%right 'UMENOS'

%start INI
//Inicio
//Definicion de gramatica
%%
/*
Tokens
comentario simple
comentario multiple
\n salto linea
\\ barra invertida
\" comilla doble
\' comilla simple
\t tabulacion
int resInt
double resDouble
boolean resBool
char resChar
string resString
if resIf
else resElse
new resNuevo
list resLista
add resAdd
print resImprimir
switch resSwitch
case resCase
default resDefault
break resBreak
while resWhile
do resDo
for resFor
continue resContinue
return resReturn
void resVoid
tolower resToLower
toupper resToUpper
length resLength
truncate resTruncate
round resRound
typeof resTypeof
toString resTostring
tochararray resTochararray
exec resExec
++ masmas
-- menosmenos
[ corchete abierto
] corchete cerrado
entero
doble
cadena
booleano
caracter
+ mas
- menos
* por
/ dividido
% mod
^ elevado
-num
= igual
== opIgual
!= opDiferente
< opMenor
> opMayor
<= opMenorIgual
>= opMayorIgual
? opTernario
: dosPuntos
|| opOr
&& opAnd
! opNegacion
( parentesis abierto
) parentesis cerrado
{ llave abierta
} llave cerrada
; punto y coma
*/
INI: INSTRUCCIONES EOF {return $1;}
;

INSTRUCCIONES: INSTRUCCIONES INSTRUCCION     {if($2!=false)$1.push($2);$$=$1;}
|INSTRUCCION                                 {$$=($1!=false) ?[$1]:[];}
;

INSTRUCCION: 
    IMPRIMIR                            {$$=$1;}
    |DECLARACION   PTCOMA               {$$=$1;}
    |ASIGNACION    PTCOMA               {$$=$1;}
    |CONDICIONIF                        {$$=$1;}
    |CONDICIONWHILE                     {$$=$1;}
    |CONDICIONDOWHILE                   {$$=$1;}
    |CONDBREAK                          {$$=$1;}
    |CODCONTINUE                        {$$=$1;}
    |CONDRETURN PTCOMA                  {$$=$1;}
    |CONDSWITCH                         {$$=$1;}
    |CONDINCREMENTO  PTCOMA             {$$=$1;}
    |CONDECREMENTO PTCOMA               {$$=$1;}
    |CONDFOR                            {$$=$1;}
    |METODOS                            {$$=$1;}
    |LLAMADA  PTCOMA                    {$$=$1;}
    |EJECUTAR PTCOMA                    {$$=$1;}
    |FUNCIONES                          {$$=$1;}
    |VECTORES PTCOMA                    {$$=$1;}
    |LISTAS PTCOMA                      {$$=$1;}
    |ASIGVECTORES PTCOMA                {$$=$1;}
    |ASIGLISTAS PTCOMA                  {$$=$1;}
    |AGREGARLISTA PTCOMA                {$$=$1;}
    //|CONDICION
    //|CICLO
    //se comento lo del inicio de Error, ya que aun no tenemos definido tal clase.
    |error PTCOMA {inicio.listaErrores.push(new errores.default('ERROR SINTACTICO',"Se esperaba un token en esta linea",@1.first_line,@1.first_column));console.log(" Error sintactico "); $$=false;}
    ;
IMPRIMIR:  RESPRINT PARABRE EXPRESION PARCIERRA  PTCOMA         {$$=new print.default($3,@1.first_line,@1.first_column);}
          |RESPRINTLN PARABRE EXPRESION PARCIERRA  PTCOMA         {$$=new println.default($3,@1.first_line,@1.first_column);}
;//{};

DECLARACION:
    TIPODATO IDENTIFICADOR        {$$= new declaracion.default($1,@1.first_line,@1.first_column,$2);}
    |TIPODATO IDENTIFICADOR IGUAL EXPRESION   {$$= new declaracion.default($1,@1.first_line,@1.first_column,$2,$4);}
    ;
TIPODATO:
    RESINT                      {$$= new Tipo.default(Tipo.tipoDato.ENTERO);}
    |RESCHAR                    {$$= new Tipo.default(Tipo.tipoDato.CARACTER);}
    |RESBOOL                    {$$= new Tipo.default(Tipo.tipoDato.BOOLEANO);}
    |RESDOUBLE                  {$$= new Tipo.default(Tipo.tipoDato.DECIMAL);}
    |RESSTRING                  {$$= new Tipo.default(Tipo.tipoDato.CADENA);}
;
ASIGNACION:
    IDENTIFICADOR IGUAL EXPRESION  {$$=new asignacion.default($1,$3,@1.first_line,@1.first_column);}
;
EXPRESION: 
    //ARITMETICAS
     EXPRESION MAS EXPRESION            {$$= new aritmeticas.default(aritmeticas.Operadores.SUMA,@1.first_line,@1.first_column,$1,$3);}
    |EXPRESION MENOS EXPRESION          {$$= new aritmeticas.default(aritmeticas.Operadores.RESTA,@1.first_line,@1.first_column,$1,$3);}
    |EXPRESION POR EXPRESION            {$$= new aritmeticas.default(aritmeticas.Operadores.MULTIPLICACION,@1.first_line,@1.first_column,$1,$3);}
    |EXPRESION DIVI EXPRESION           {$$= new aritmeticas.default(aritmeticas.Operadores.DIVISION,@1.first_line,@1.first_column,$1,$3);}
    |EXPRESION MOD EXPRESION            {$$= new aritmeticas.default(aritmeticas.Operadores.MODULADOR,@1.first_line,@1.first_column,$1,$3);}
    |EXPRESION POTENCIA EXPRESION       {$$= new aritmeticas.default(aritmeticas.Operadores.POTENCIA,@1.first_line,@1.first_column,$1,$3);}
    |PARABRE EXPRESION PARCIERRA        {$$=$2;}
    |MENOS EXPRESION %prec UMENOS       {$$=new aritmeticas.default(aritmeticas.Operadores.MENOSNUM,@1.first_line,@1.first_column,$2);}
    //RELACIONALES
    |EXPRESION COMPARACION EXPRESION    {$$= new relacional.default(relacional.Relacionales.IGUAL,@1.first_line,@1.first_column,$1,$3);}
    |EXPRESION DIFERENTE EXPRESION      {$$= new relacional.default(relacional.Relacionales.DIFERENTE,@1.first_line,@1.first_column,$1,$3);}
    |EXPRESION MAYOR EXPRESION          {$$= new relacional.default(relacional.Relacionales.MAYOR,@1.first_line,@1.first_column,$1,$3);}
    |EXPRESION MENOR EXPRESION          {$$= new relacional.default(relacional.Relacionales.MENOR,@1.first_line,@1.first_column,$1,$3);}
    |IFTERNARIO                         {$$=$1;}
    |EXPRESION MAYORIGUAL EXPRESION     {$$= new relacional.default(relacional.Relacionales.MAYORIGUAL,@1.first_line,@1.first_column,$1,$3);}
    |EXPRESION MENORIGUAL EXPRESION     {$$= new relacional.default(relacional.Relacionales.MENORIGUAL,@1.first_line,@1.first_column,$1,$3);}
    //LOGICAS
    |EXPRESION AND EXPRESION            {$$=new logicas.default(logicas.Logicas.AND,@1.first_line,@1.first_column,$1,$3);}
    |EXPRESION OR EXPRESION             {$$=new logicas.default(logicas.Logicas.OR,@1.first_line,@1.first_column,$1,$3);}
    |NOT EXPRESION                      {$$=new logicas.default(logicas.Logicas.NOT,@1.first_line,@1.first_column,$2);}
    
    //NATIVO
    |ENTERO                     {$$= new nativo.default(new Tipo.default(Tipo.tipoDato.ENTERO),$1,@1.first_line,@1.first_column);}
    |DECIMAL                    {$$= new nativo.default(new Tipo.default(Tipo.tipoDato.DECIMAL),$1,@1.first_line,@1.first_column);}
    |CADENA                     {$$= new nativo.default(new Tipo.default(Tipo.tipoDato.CADENA),$1,@1.first_line,@1.first_column);}
    |BOOLEANO                   {$$= new nativo.default(new Tipo.default(Tipo.tipoDato.BOOLEANO),$1,@1.first_line,@1.first_column);}
    |CARACTER                   {$$= new nativo.default(new Tipo.default(Tipo.tipoDato.CARACTER),$1.replace(/['"]+/g, ""),@1.first_line,@1.first_column);}
    
    |IDENTIFICADOR              {$$=new identificador.default($1,@1.first_line,@1.first_column);}         
    |CONDINCREMENTO             {$$=$1;}
    |CONDECREMENTO              {$$=$1;}
    |LLAMADA                    {$$=$1;}
    |ACCESOVECTOR               {$$=$1;}
    |ACCESOLISTAS               {$$=$1;}
    |FUNCNATIVA PARABRE EXPRESION PARCIERRA {$$=new funcNativa.default($1,$3,@1.first_line,@1.first_column); }
    |PARABRE TIPODATO PARCIERRA EXPRESION {$$=new casteo.default($2,$4,@1.first_line,@1.first_column);}
 
    ;
CONDICIONIF:
    RESIF PARABRE EXPRESION /*COND1*/PARCIERRA BLOQUEINSTRUCCION                                                        {$$= new condIf.default(@1.first_line,@1.first_column,$3,$5,undefined,undefined);}
    |RESIF PARABRE EXPRESION/*COND1*/ PARCIERRA BLOQUEINSTRUCCION RESELSE/*true*/ BLOQUEINSTRUCCION    {$$= new condIf.default(@1.first_line,@1.first_column,$3,$5,$7,undefined);}
    |RESIF PARABRE EXPRESION PARCIERRA BLOQUEINSTRUCCION RESELSE /*true*/CONDICIONIF                                     {$$= new condIf.default(@1.first_line,@1.first_column,$3,$5,undefined,$7);}     
    ;
CONDICIONWHILE:
    RESWHILE PARABRE EXPRESION PARCIERRA BLOQUEINSTRUCCION              {$$=new condWhile.default($3,$5,@1.first_line,@1.first_column);}
    ;
CONDICIONDOWHILE:
    RESDO BLOQUEINSTRUCCION RESWHILE PARABRE EXPRESION PARCIERRA PTCOMA {$$=new condDoWhile.default($5,$2,@1.first_line,@1.first_column);}
    ;
IFTERNARIO:
    EXPRESION INTERROGACION EXPRESION DOSPUNTOS EXPRESION   {$$=new condTernario.default($1,$3,$5,@1.first_line,@1.first_column);}
    ;
CONDBREAK:
    RESBREAK PTCOMA                                                     {$$=new condBreak.default(@1.first_line,@1.first_column); }
    ;
CODCONTINUE:
    RESCONTINUE PTCOMA                                                  {$$=new condContinue.default(@1.first_line,@1.first_column); }
    ;
CONDRETURN:
    RESRETURN                                                     {$$=new condReturn.default(@1.first_line,@1.first_column); }
    |RESRETURN EXPRESION                                          {$$=new condReturn.default(@1.first_line,@1.first_column,$2); }
    ;
CONDSWITCH:
    RESSWITCH PARABRE EXPRESION PARCIERRA LLAVEABRE LISTACASOS DEFECTO LLAVECIERRA    {$$=new condSwitch.default(@1.first_line,@1.first_column,$3,$6,$7);}
    |RESSWITCH PARABRE EXPRESION PARCIERRA LLAVEABRE LISTACASOS LLAVECIERRA         {$$=new condSwitch.default(@1.first_line,@1.first_column,$3,$6,undefined);}
    |RESSWITCH PARABRE EXPRESION PARCIERRA LLAVEABRE DEFECTO LLAVECIERRA            {$$=new condSwitch.default(@1.first_line,@1.first_column,$3,undefined,$6);}
    ;
LISTACASOS: 
    LISTACASOS CASO                                 {if($2!=false)$1.push($2);$$=$1;}
    |CASO                                             {$$=($1!=false) ?[$1]:[];}                                                                             
    ;
CASO:
    RESCASE EXPRESION DOSPUNTOS INSTRUCCIONES                                     {$$=new condCase.default(@1.first_line,@1.first_column,$2,$4);} 
    ;
DEFECTO:
    RESDEFAULT DOSPUNTOS INSTRUCCIONES                                              {$$=new condDefault.default(@1.first_line,@1.first_column,$3);}  
    ;
CONDINCREMENTO:
    EXPRESION MAS MAS                                                              {$$=new Incremento.default($1,@1.first_line,@1.first_column);}
    ;
CONDECREMENTO:
    EXPRESION MENOS MENOS                                                           {$$=new Decremento.default($1,@1.first_line,@1.first_column);}
    ;
CONDFOR:
    RESFOR PARABRE DECLASIG PTCOMA EXPRESION PTCOMA ACTUALIZACION PARCIERRA BLOQUEINSTRUCCION {$$=new condFor.default($3,$5,$7,$9,@1.first_line,@1.first_column);}
    ;
DECLASIG:
    DECLARACION {$$=$1;}
    |ASIGNACION {$$=$1;}
    ;
ACTUALIZACION:
    CONDINCREMENTO {$$=$1;}
    |CONDECREMENTO {$$=$1;}
    |ASIGNACION    {$$=$1;}
    ;
METODOS:
    //RESVOID IDENTIFICADOR PARABRE PARAMETROS PARCIERRA BLOQUEINSTRUCCION {$$=new metodos.default(new Tipo.default(Tipo.tipoDato.VOID),@1.first_line,@1.first_column,$2,$4,$6);}
    IDENTIFICADOR PARABRE PARAMETROS PARCIERRA DOSPUNTOS RESVOID BLOQUEINSTRUCCION  {$$=new metodos.default(new Tipo.default(Tipo.tipoDato.VOID),@1.first_line,@1.first_column,$1,$3,$7);}
    //|RESVOID IDENTIFICADOR PARABRE PARCIERRA BLOQUEINSTRUCCION           {$$=new metodos.default(new Tipo.default(Tipo.tipoDato.VOID),@1.first_line,@1.first_column,$2,[],$5);}
    |IDENTIFICADOR PARABRE PARCIERRA DOSPUNTOS RESVOID BLOQUEINSTRUCCION            {$$=new metodos.default(new Tipo.default(Tipo.tipoDato.VOID),@1.first_line,@1.first_column,$1,[],$6);}
    
    |IDENTIFICADOR PARABRE PARAMETROS PARCIERRA BLOQUEINSTRUCCION                   {$$=new metodos.default(new Tipo.default(Tipo.tipoDato.VOID),@1.first_line,@1.first_column,$1,$3,$5);}
    
    |IDENTIFICADOR PARABRE PARCIERRA BLOQUEINSTRUCCION                              {$$=new metodos.default(new Tipo.default(Tipo.tipoDato.VOID),@1.first_line,@1.first_column,$1,[],$4);}
    ;
PARAMETROS:
    PARAMETROS COMA TIPODATO IDENTIFICADOR    {$1.push({tipato:$3,identificador:$4});$$=$1;} 
    |PARAMETROS COMA TIPODATO CORCHABRE CORCHCIERRA IDENTIFICADOR   {$1.push({tipato:$3,identificador:$6,arreglo:true});$$=$1;} 
    |PARAMETROS COMA RESLIST MENOR TIPODATO MAYOR IDENTIFICADOR                     {$1.push({tipato:$5,identificador:$7,lista:true});$$=$1;} 
    |TIPODATO CORCHABRE CORCHCIERRA IDENTIFICADOR                   {$$=[{tipato:$1,identificador:$4,arreglo:true}];} 
    |RESLIST MENOR TIPODATO MAYOR IDENTIFICADOR                     {$$=[{tipato:$3,identificador:$5,lista:true}];} 
    |TIPODATO IDENTIFICADOR                   {$$=[{tipato:$1,identificador:$2}];} 
    ;
LLAMADA:
    IDENTIFICADOR PARABRE PARLLAMADA PARCIERRA  {$$=new llamadas.default($1,$3,@1.first_line,@1.first_column);}
    |IDENTIFICADOR PARABRE PARCIERRA            {$$=new llamadas.default($1,[],@1.first_line,@1.first_column);}
    ;
PARLLAMADA:
    PARLLAMADA COMA EXPRESION               {$1.push($3);$$=$1;} 
    |EXPRESION                               {$$=[$1];}
    ;
EJECUTAR:
    RESEXEC IDENTIFICADOR PARABRE PARLLAMADA PARCIERRA  {$$=new ejecucion.default($2,$4,@1.first_line,@1.first_column);}
    |RESEXEC IDENTIFICADOR PARABRE PARCIERRA            {$$=new ejecucion.default($2,[],@1.first_line,@1.first_column);}                        
    ;
FUNCIONES:
    //TIPODATO IDENTIFICADOR PARABRE PARAMETROS PARCIERRA BLOQUEINSTRUCCION {$$=new funciones.default($1,@1.first_line,@1.first_column,$2,$4,$6);}
    IDENTIFICADOR PARABRE PARAMETROS PARCIERRA DOSPUNTOS TIPODATO BLOQUEINSTRUCCION {$$=new funciones.default($6,@1.first_line,@1.first_column,$1,$3,$7);}
    //|TIPODATO IDENTIFICADOR PARABRE PARCIERRA BLOQUEINSTRUCCION           {$$=new funciones.default($1,@1.first_line,@1.first_column,$2,[],$5);}
    |IDENTIFICADOR PARABRE PARCIERRA DOSPUNTOS TIPODATO BLOQUEINSTRUCCION           {$$=new funciones.default($5,@1.first_line,@1.first_column,$1,[],$6);}
    ;
VECTORES:
    //TIPODATO CORCHABRE CORCHCIERRA IDENTIFICADOR IGUAL RESNUEVO TIPODATO CORCHABRE EXPRESION CORCHCIERRA {$$=new vectores.default($1,$4,true,@1.first_line,@1.first_column,$9,$7);}
    TIPODATO IDENTIFICADOR CORCHABRE CORCHCIERRA IGUAL RESNUEVO TIPODATO CORCHABRE EXPRESION CORCHCIERRA {$$=new vectores.default($1,$2,true,@1.first_line,@1.first_column,$9,$7);}
    //|TIPODATO CORCHABRE CORCHCIERRA IDENTIFICADOR IGUAL LLAVEABRE LISTAVALORES LLAVECIERRA  {$$=new vectores.default($1,$4,false,@1.first_line,@1.first_column,undefined,undefined,$7);}
    |TIPODATO IDENTIFICADOR CORCHABRE CORCHCIERRA IGUAL CORCHABRE LISTAVALORES CORCHCIERRA               {$$=new vectores.default($1,$2,false,@1.first_line,@1.first_column,undefined,undefined,$7);}
    ;
LISTAVALORES:
    LISTAVALORES COMA EXPRESION         {$1.push($3);$$=$1;} 
    |EXPRESION                          {$$=[$1];}
    ;
ACCESOVECTOR:
    IDENTIFICADOR CORCHABRE EXPRESION CORCHCIERRA {$$=new accesoVector.default($1,$3,@1.first_line,@1.first_column);}
    ;
ASIGVECTORES:
    IDENTIFICADOR CORCHABRE EXPRESION CORCHCIERRA IGUAL EXPRESION {$$=new modiVector.default($1, $3, $6,@1.first_line,@1.first_column);}
    ;
LISTAS:
    RESLIST MENOR TIPODATO MAYOR IDENTIFICADOR IGUAL RESNUEVO RESLIST MENOR TIPODATO MAYOR {$$=new listas.default($3, $5,@1.first_line,@1.first_column, $10,undefined);}
    |RESLIST MENOR TIPODATO MAYOR IDENTIFICADOR IGUAL EXPRESION {$$=new listas.default($3, $5,@1.first_line,@1.first_column, undefined,$7);}
    ;
ACCESOLISTAS:
    IDENTIFICADOR CORCHABRE CORCHABRE EXPRESION CORCHCIERRA CORCHCIERRA {$$=new accesoLista.default($1,$4,@1.first_line,@1.first_column);}
    ;
ASIGLISTAS:
    IDENTIFICADOR CORCHABRE CORCHABRE EXPRESION CORCHCIERRA CORCHCIERRA IGUAL EXPRESION {$$=new modiLista.default($1, $4, $8,@1.first_line,@1.first_column);}
    ;
AGREGARLISTA:
    IDENTIFICADOR PUNTO RESADD PARABRE EXPRESION PARCIERRA {$$=new agregarLista.default($1,$5,@1.first_line,@1.first_column);}
    ;
FUNCNATIVA:
    RESLOW          {$$=$1;}
    |RESUP          {$$=$1;}
    |RESLENG        {$$=$1;}
    |RESTRUN        {$$=$1;}
    |RESROUND       {$$=$1;}
    |RESTYPE        {$$=$1;}
    |RESTOSTR       {$$=$1;}
    |RESTOCHRARR    {$$=$1;}
    ;
BLOQUEINSTRUCCION:
    LLAVEABRE INSTRUCCIONES LLAVECIERRA {$$=$2;}
    |LLAVEABRE LLAVECIERRA              {$$=[];}
    ;
    /*
    |TIPODATO
    TIPODATO:
        RESINT
        |RESCHAR
        |RESSTRING
        |RESBOOL
        |RESDOUBLE
    |DECLARACION
    DECLARACION:
        TIPODATO IDENTIFICADOR 
        |TIPODATO IDENTIFICADOR IGUAL EXPRESION PTCOMA
        |ERROR PTCOMA
    a=b;
    |ASIGNACION:
        IDENTIFICADOR IGUAL EXPRESION PTCOMA

    DECONTROL:
        |IF
        |SWITCH
    CICLICAS:
        |WHILE
        |DOWHILE
        |FOR
    IF:
        RESIF PARABRE EXPRESION PARCIERRA LLAVEABRE INSTRUCCIONES LLAVECIERRA
        |RESIF PARABRE EXPRESION PARCIERRA LLAVEABRE INSTRUCCIONES LLAVECIERRA else lalveabre instrucciones llavecierra
        |RESIF PARABRE EXPRESION PARCIERRA LLAVEABRE INSTRUCCIONES LLAVECIERRA else IF
    */