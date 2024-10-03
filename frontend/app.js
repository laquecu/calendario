fetch('http://localhost:3000/api/hola')
    .then(response => response.json())
    .then(data => {
        document.getElementById('mensaje').textContent = data.mensaje;
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Obtener y mostrar la lista de personas
fetch('http://localhost:3000/api/personas')
.then(response => response.json())
.then(data => {
    console.log('Datos recibidos:', data);
    const personasList = document.getElementById('personasList');
    personasList.innerHTML = ''; // Limpiar la lista existente

    data.forEach(persona => {
        const li = document.createElement('li');
        li.textContent = `${persona.nombre} - ${persona.edad} años`;
        personasList.appendChild(li);
    });
})
.catch(error => {
    console.error('Error al cargar personas:', error);
});