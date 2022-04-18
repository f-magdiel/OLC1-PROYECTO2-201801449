import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card,CardImg,Button} from 'react-bootstrap'
function Home(){
    return(
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}} >
        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title>Compscript</Card.Title>
          <Card.Text>
            Este es el segundo proyecto de Organizacion y Compiladores 1
          </Card.Text>
          <Button variant="primary">Ir al Compilador</Button>
        </Card.Body>
      </Card>
        </div>
    );
}

export default Home;