// frontend/src/App.js
//import React, { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CalendarComponent from './CalendarComponent';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Home from './Home'; // La página principal
import './portada.css';
import BuscadorClientes from './buscadorClientes';
import AltaClientes from './AltaClientes';

function App() {
  
  const location = useLocation(); // Hook para obtener la ubicación actual

  return (

    
    <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">Home</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                
                <li className="nav-item">
                  <Link className="nav-link" to="/home">Clientes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/calendario">Calendario</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/buscador">Buscar Cliente</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/alta_cliente">Alta Cliente</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/home" element={<Home />} /> {/* Ruta para el componente Home */}
          <Route path="/calendario" element={<CalendarComponent />} /> {/* Ruta para el componente OtherPage */}
          <Route path="/buscador" element={<BuscadorClientes />} />
          <Route path='/alta_cliente' element={<AltaClientes/>} />
        </Routes>
        
        
        {location.pathname === '/' && (
        <div className='cover'>
          <h1 className='title'>Tu Agenda Electrónica</h1>
        </div>
      )}
        
    </div>  
    
    
    
  );
}


export default App;

