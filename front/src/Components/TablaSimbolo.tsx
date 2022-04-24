import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table,Button} from 'react-bootstrap'
import axios from 'axios';

function TablaSimbolo(){
    const [tabsym,setTabSym] = useState<any[]>([]);
    
    const consultaTabla = async()=>{
      const res = await axios.get('http://localhost:5000/consultatable')
      setTabSym(res.data.tabla)
      console.log(tabsym)
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
      <th>Entorno</th>
      <th>Forma</th>
      <th>Identificador</th>
      <th>Tipo</th>
      <th>Valor</th>

    </tr>
  </thead>
  <tbody>
      {
        tabsym.map(tab=>(
          <tr>
              <td>1</td>
              <td>{tab.linea}</td>
              <td>{tab.columna}</td>
              <td>{tab.entorno}</td>
              <td>{tab.forma}</td>
              <td>{tab.identificador}</td>
              <td>{tab.tipo}</td>
              <td>{tab.valor}</td>
          </tr>
        ))
       
      } 
  </tbody>
</Table>
</div>
    );
}

export default TablaSimbolo;