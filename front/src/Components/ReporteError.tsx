import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table,Button} from 'react-bootstrap'
import axios from 'axios';
import '../index.css'
function ReporteError(){

  const [error,setError] = useState<any[]>([]);
  

  /* useEffect(()=>{
    console.log("get method consulta error")
    consultaError()
  },[]) */

  const consultaError = async() =>{
    const res = await axios.get('http://localhost:5000/consultaerror')
    setError(res.data.errores);
   
  }
    return(
      <div>
        <div>
        <Button id={"btn"}onClick={consultaError} variant="dark">Ver tabla</Button>
        </div>
        <div>
        <Table striped bordered hover>
  <thead>
    <tr>
      <th>No</th>
      <th>Columna</th>
      <th>Fila</th>
      <th>Descripcion</th>
      <th>Tipo</th>
    </tr>
    
  </thead>
  <tbody>
   {
     error.map(er=>(
      <tr>
         <td>1</td>
         <td>{er.columna}</td>
         <td>{er.fila}</td>
         <td>{er.desc}</td>
         <td>{er.tipoError}</td>
    </tr>
    ))
   

   }
  </tbody>
</Table>
</div>
        
</div>
    );
}

export default ReporteError;