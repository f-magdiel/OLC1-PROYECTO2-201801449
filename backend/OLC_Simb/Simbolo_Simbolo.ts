import Tipo from './Simbolo_Tipo';

export default class Simbolo {
  private tipo: Tipo;//esta es de la clase tipo el cual ya se definio nuestros tipos de variable int, string,..ectc
  private identificador: String;
  private valor: any; //este es el valor que va a recibir, que pueda ser cualquier tipo de datos

  constructor(tipo: Tipo, identificador: String, valor?: any) {//para crear un simbolo, ira su tipo de dato su ID, su objeto
    this.tipo = tipo;
    this.identificador = identificador.toLowerCase(); // convierto en minisculas
    this.valor = valor;
  }
  //getters y setters de los simbolos
  public gettipo(): Tipo {
    return this.tipo;
  }
  public settipo(value: Tipo) {
    this.tipo = value;
  }
  public getidentificador(): String {
    return this.identificador;
  }
  public setidentificador(value: String) {
    this.identificador = value;
  }
  public getvalor(): any {
    return this.valor;
  }
  public setvalor(value: any) {
    this.valor = value;
  }
}
