const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const port = 3000;

const { sendWhatsAppMessage } = require('./whatsapp');
const mensaje_recordatorio = require('./mensaje_recordatorio');

app.use(cors());
app.use(express.json());



// Ruta para obtener "Hola Mundo"
app.get('/api/hola', (req, res) => {
    res.json({ mensaje: 'Hola Mundo' });
});

// Ruta para obtener la lista de personas de la base de datos
app.get('/api/personas', (req, res) => {
    const sql = 'SELECT nombre, edad FROM personas';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

//Ruta para obtener todos los eventos
app.get('/api/eventos', (req, res) => {
    db.all('SELECT * FROM eventos', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });

//Ruta para seleccionar un solo evento
app.get('/api/eventos/:id', (req, res) => {
    const { id } = req.params;
    console.log('ID recibido: ${id}');
    db.get('SELECT * FROM eventos WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Evento no encontrado' });  // Si no encuentra el evento, retorna 404
        }
        res.json(row);
    });
});

//Ruta para crear un nuevo evento
app.post('/api/eventos', (req, res) => {
    const { nombre, start, end, telefono } = req.body;
    // Validar que los campos estén completos
  if (!nombre || !start || !end || !telefono) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  const sql = 'INSERT INTO eventos (nombre, start, end, telefono) VALUES (?, ?, ?, ?)';
  const params = [nombre, start, end, telefono];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Mensaje a enviar
    const mensaje = `Nuevo evento creado: ${nombre}, que empieza el ${start} y termina el ${end}.`;

    // Enviar WhatsApp
    sendWhatsAppMessage(telefono, mensaje); // Se asume que el teléfono viene en la solicitud

    
    res.status(201).json({
      id: this.lastID,
      nombre,
      start,
      end,
      telefono,
    });
  });
});

//Para eliminar un evento
app.delete('/api/eventos/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM eventos WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Verificamos si se ha eliminado algún evento
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }
        res.status(204).send(); // Devuelve un estado 204 sin contenido
    });
});

//llamamos a la funcion para que active el evento de enviar los mensajes recordatorios
mensaje_recordatorio.programarRecordatorios();

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});



// Cerrar la base de datos al terminar el proceso
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error al cerrar la base de datos:', err.message);
        }
        console.log('Base de datos cerrada.');
        process.exit(0);
    });
});