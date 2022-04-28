import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table,Button} from 'react-bootstrap'
import axios from 'axios';

function TablaSimbolo(){
    const [tabsym,setTabSym] = useState<any[]>([]);
    
    const consultaTabla = async()=>{
      const res = await axios.get('http://localhost:5000/consultatable')
      setTabSym(res.data.tabla)
      console.log(res.data.tala)
    }
    return(
      <div>
        <div>
        <Button id={"btn"} onClick={consultaTabla} variant="dark">Ver tabla</Button>
        </div>
        <Table striped bordered hover>
  <thead>
    <tr>
      <th>No</th>
      <th>Línea</th>
      <th>Columna</th>
      <th>Ambito</th>
      <th>Tipo de Dato</th>
      <th>Identificador</th>
      <th>Tipo de Método</th>
      <th>Valor</th>

    </tr>
  </thead>
  <tbody>
      {
        tabsym.map((tab,index)=>(
          
          <tr>
              <td>1</td>
              <td key={index}>{tab.linea}</td>
              <td key={index}>{tab.columna}</td>
              <td key={index}>{tab.entorno}</td>
              <td key={index}>{tab.forma}</td>
              <td key={index}>{tab.identificador}</td>
              <td key={index}>{tab.tipo}</td>
              <td key={index}>{tab.valor}</td>
          </tr>
        ))
       
      } 
  </tbody>
</Table>
</div>
    );
}

export default TablaSimbolo;