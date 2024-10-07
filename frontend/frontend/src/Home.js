import React, { useState, useEffect } from 'react';
import './App.css';

const Home = () => {
    const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Hacer la petición a la API del backend
    fetch('http://localhost:3000/api/clientes')
      .then(response => response.json())
      .then(data => setClientes(data))
      .catch(error => console.error('Error al obtener personas:', error));
  }, []);
  
  return (
    <div class='table-container'>

      <h1>Lista de Clientes</h1>
      
      <table>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Apellidos</th>
        <th>E-mail</th>
        <th>Teléfono</th>
      </tr>
    </thead>
    <tbody>
      {clientes.map((cliente, index) => (
        <tr key={index}>
          <td>{cliente.nombre}</td>
          <td>{cliente.apellidos}</td>
          <td>{cliente.email}</td>
          <td>{cliente.telefono}</td>
        </tr>
      ))}
    </tbody>
  </table>
    </div>

    
  );
};

export default Home;
