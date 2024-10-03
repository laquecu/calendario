const cron = require('node-cron');
const { client } = require('./whatsapp');
const db = require('./db');





// Función para enviar mensajes
const enviarRecordatorio = (evento) => {
    const mensaje = `¡Hola! Este es un recordatorio de tu cita: Nombre: "${evento.nombre}" que tiene lugar a las ${evento.start}.`;
    console.log(evento.nombre);
    // Enviar mensaje de WhatsApp usando whatsapp-web.js
    client.sendMessage(`${evento.telefono}@c.us`, mensaje).then(response => {
        console.log(`Mensaje enviado a ${evento.telefono}`, response);
    }).catch(err => {
        console.error('Error al enviar el mensaje:', err);
    });
};

// Programar tarea para ejecutarse a las 00:00 todos los días
const programarRecordatorios = () => {
    cron.schedule('47 12 * * *', () => {
        console.log('Ejecutando tarea programada para verificar eventos del día siguiente...');

        const hoy = new Date();
        const manana = new Date();
        manana.setDate(hoy.getDate() + 1);
        const mananaISO = manana.toISOString().split('T')[0];
        
        console.log(mananaISO);
        // Consultar los eventos que ocurren mañana
        db.all('SELECT * FROM eventos WHERE DATE(start) = ?', [mananaISO], (err, rows) => {
            if (err) {
                return console.error('Error al consultar eventos:', err);
            }
            if (rows.length === 0) {
                console.log('No hay eventos para enviar recordatorios.');
            } else {
                console.log(`Se encontraron ${rows.length} eventos para enviar recordatorios.`);
                console.log('Eventos:', rows);
            }
            // Enviar recordatorios para cada evento que ocurrirá mañana
            rows.forEach(evento => {
                enviarRecordatorio(evento);
            });
        });
    });
};

// Exporta la función para que pueda ser usada en otros archivos
module.exports = {
    programarRecordatorios, enviarRecordatorio }