import React,{Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Nav,Navbar,Container,NavDropdown,Card} from 'react-bootstrap'
import Home from "./Components/Home"
import Compilador from "./Components/Compilador"
import ReporteError from "./Components/ReporteError"
import ReporteAST from "./Components/ReporteAST"
import Tabla from "./Components/TablaSimbolo"

import {
    BrowserRouter as Router,
    Route,
    Link,
    Routes
} from "react-router-dom";


function App() {
  return (
    <Router>
      <div>
    <Navbar bg="dark" variant="dark" expand="lg">
  <Container>
    <Navbar.Brand as={Link} to ={"/home"}>Compscript</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link as={Link} to ={"/compilador"} >Compilador</Nav.Link>
        <Nav.Link as={Link} to ={"/reporteError"}>Reporte Error</Nav.Link>
        <Nav.Link as={Link} to = {"/reporteAST"}>Reporte AST</Nav.Link>
        <Nav.Link as={Link} to = {"/tablaSimbolo"}>Tabla Simbolo</Nav.Link>
      </Nav>
    </Navbar.Collapse>
    
  </Container>
  
</Navbar>
</div>
<div>
<Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/home" element={<Home/>}/>
  <Route path="/compilador" element={<Compilador/>}/>
  <Route path="/reporteError" element={<ReporteError/>}/>
  <Route path="/reporteAST" element={<ReporteAST/>}/>
  <Route path="/tablaSimbolo" element={<Tabla/>}/>
</Routes>
</div>
</Router>


  );
}

export default App;
