import React, { useState, useEffect } from 'react';

const BuscadorClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      // Hacer la petición a la API del backend
      fetch('http://localhost:3000/api/clientes')
        .then(response => response.json())
        .then(data => setClientes(data))
        .catch(error => console.error('Error al obtener personas:', error));
    }, []);

    // Filtra los clientes según el término de búsqueda
    const filteredClientes = clientes.filter(cliente => {
        return (
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefono.includes(searchTerm)
        );
    });
    
  return (
    <div className="buscador-clientes">
      <h2>Buscar Clientes</h2>
      <input
        type="text"
        placeholder="Buscar por nombre, apellidos, e-mail o teléfono"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="table-container">
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
            {filteredClientes.map((cliente, index) => (
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
    </div>
  );
};

export default BuscadorClientes;
