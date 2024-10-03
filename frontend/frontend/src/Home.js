import React, { useState, useEffect } from 'react';

const Home = () => {
    const [personas, setPersonas] = useState([]);

  useEffect(() => {
    // Hacer la petición a la API del backend
    fetch('http://localhost:3000/api/personas')
      .then(response => response.json())
      .then(data => setPersonas(data))
      .catch(error => console.error('Error al obtener personas:', error));
  }, []);

  return (
    <div>

      <h1>Lista de Personas</h1>
      <ul>
        {personas.map((persona, index) => (
          <li key={index}>
            {persona.nombre} - {persona.edad} años
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
