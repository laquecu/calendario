import React, { useState } from 'react';

const AltaClientes = () => {
    // Estado para almacenar los datos del formulario
    const [cliente, setCliente] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: ''
    });

    const [message, setMessage] = useState('');

    // Función para manejar los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente({
            ...cliente,
            [name]: value
        });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cliente),
            });

            if (!response.ok) {
                throw new Error('Error al crear el cliente');
            }

            const data = await response.json();
            setMessage(`Cliente creado con ID: ${data.id}`);
            // Limpiar los campos del formulario después de crear el cliente
            setCliente({
                nombre: '',
                apellidos: '',
                email: '',
                telefono: ''
            });
        } catch (error) {
            setMessage('Error al crear el cliente: ' + error.message);
        }
    };

    return (
        <div className="alta-clientes">
            <h2>Alta de Nuevos Clientes</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={cliente.nombre}
                        onChange={handleChange}
                        required
                        className='form-control'
                    />
                </div>
                <div>
                    <label>Apellidos:</label>
                    <input
                        type="text"
                        name="apellidos"
                        value={cliente.apellidos}
                        onChange={handleChange}
                        required
                        className='form-control'
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={cliente.email}
                        onChange={handleChange}
                        required
                        className='form-control'
                    />
                </div>
                <div>
                    <label>Teléfono:</label>
                    <input
                        type="text"
                        name="telefono"
                        value={cliente.telefono}
                        onChange={handleChange}
                        required
                        className='form-control'
                    />
                </div>
                <button type="submit" className='btn btn-primary mt-3'>Crear Cliente</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AltaClientes;
