import React, { useState, useEffect } from 'react';

const BuscadorClientes = () => {
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [eventDetails, setEventDetails] = useState({
        start: '',
        end: '',
    });
    const [message, setMessage] = useState('');

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

    // Manejar el clic en un cliente
    const handleClienteClick = (cliente) => {
        setSelectedCliente(cliente);
        setEventDetails({
        start: '',
        end: '',
        });
        setMessage('');
    };

    // Función para crear el evento en la base de datos
    const createEvent = async () => {
        try {
        const response = await fetch('http://localhost:3000/api/eventos', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            nombre: selectedCliente.nombre,
            telefono: selectedCliente.telefono,
            start: eventDetails.start,
            end: eventDetails.end,
            }),
        });

        if (!response.ok) {
            throw new Error('Error al crear el evento');
        }

        const data = await response.json();
        setMessage(`Evento creado con ID: ${data.id}`);
        // Limpia la selección y los detalles del evento
        setSelectedCliente(null);
        setEventDetails({
            start: '',
            end: '',
        });
        } catch (error) {
        setMessage('Error al crear el evento: ' + error.message);
        }
    };

    const closeForm = () => {
        setSelectedCliente(null);
        setEventDetails({
          start: '',
          end: '',
        });
        setMessage('');
      };

  return (
    <div className="buscador-clientes">
    <div className='buscador'>
      <h2>Buscar Clientes</h2>
      <input
        type="text"
        placeholder="Buscar por nombre, apellidos, e-mail o teléfono"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>E-mail</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente, index) => (
              /*<tr key={index} onClick={() => handleClienteClick(cliente)}
              style={{ cursor: 'pointer' }} >*/
              <tr key={index}>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellidos}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>
                  <button onClick={() => handleClienteClick(cliente)}
                  className='btn btn-link' title='crear cita'>Cita</button>
                </td>
                </tr>
              /*</tr>*/
            ))}
          </tbody>
        </table>
      </div>
      {selectedCliente && (
        <div className="centered-form">
        <div className="form-container">
          <h3>Crear Evento para {selectedCliente.nombre}</h3>
          <form onSubmit={e => { e.preventDefault(); createEvent(); }}>
            <div>
              <label>Teléfono:</label>
              <input type="text" value={selectedCliente.telefono} readOnly className='form-control'/>
            </div>
            <div>
              <label>Fecha de Inicio:</label>
              <input
                type="datetime-local"
                value={eventDetails.start}
                onChange={e => setEventDetails({ ...eventDetails, start: e.target.value })}
                required
                className='form-control'
              />
            </div>
            <div>
              <label>Fecha de Fin:</label>
              <input
                type="datetime-local"
                value={eventDetails.end}
                onChange={e => setEventDetails({ ...eventDetails, end: e.target.value })}
                required
                className='form-control'
              />
            </div>
            <div className="d-flex justify-content-between">
                <button type="submit" className='btn btn-primary mt-3'>Crear Evento</button>
                <button type='button' className='btn btn-secondary mt-3' onClick={closeForm}>Cerrar</button>
            </div>
          </form>
          {message && <p>{message}</p>}
        </div>
        </div>
      )}
    </div>
    
  );
};

export default BuscadorClientes;
