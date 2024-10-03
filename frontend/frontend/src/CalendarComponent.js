import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { es } from 'date-fns/locale';
//import { parseISO, isValid } from 'date-fns';
import './App.css';
import Modal from 'react-bootstrap/Modal';
// Configuración de localización para fechas
const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const messages = {
    next: 'Siguiente',
    previous: 'Anterior',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango.',
    showMore: total => `+ Ver más (${total})`,
  };

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [newEvent, setNewEvent] = useState({ title: '', start: new Date(), end: new Date() });
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/eventos')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data || data.length === 0) {
          console.warn("No hay datos disponibles");  // Depuración
        } else {
          console.log("Datos recibidos:", data);
          const mappedEvents = data.map(evento => ({
            id: evento.id,
            title: evento.nombre,         // Mapeo de 'nombre' a 'title'
            start: new Date(evento.start), // Convertir la fecha de inicio a objeto Date
            end: new Date(evento.end), // Convertir la fecha de fin a objeto Date
            fecha: evento.fecha, 
            telefono: evento.telefono,     
          }));
          setEvents(mappedEvents);
          
        }
      })
      .catch(error => {
        console.error("Error al cargar eventos:", error);
      });
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    setIsEditMode(false); // Modo ver detalles
  };

  const handleSelect = ({ start, end }) => {
    // Configura el nuevo evento con la fecha seleccionada
    //setNewEvent({ ...newEvent, start, end });
    setNewEvent({ ...newEvent, startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0] });
    setShowInput(true); // Muestra el formulario de entrada
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario

    const startDateTime = new Date(`${newEvent.startDate}T${newEvent.startTime}`);
    const endDateTime = new Date(`${newEvent.endDate}T${newEvent.endTime}`);
    
    // Guarda en el backend
    fetch('http://localhost:3000/api/eventos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: newEvent.title,
        //start: newEvent.start,
        //end: newEvent.end,
        start: startDateTime,
        end: endDateTime,
        telefono: newEvent.telefono,
      }),
    })
    .then(response => response.json())
    .then(event => {
      setEvents([...events, {
        id: event.id,
        title: event.nombre,
        start: new Date(event.start),
        end: new Date(event.end),
        telefono: event.telefono
      }]);
      setShowInput(false); // Oculta el formulario
      //setNewEvent({ title: '', start: new Date(), end: new Date() }); // Resetea el formulario
      setNewEvent({ title: '', startDate: '', startTime: '', endDate: '', endTime: '', telefono: '' }); // Resetea el formulario
    })
    .catch(error => {
      console.error('Error al agregar evento:', error);
    });
  };

  const handleClose = () => {
    setShowInput(false); // Cerrar el formulario al hacer clic en "Cerrar"
  };

  // Función para eliminar el evento
  const handleDelete = (eventId) => {
    fetch(`http://localhost:3000/api/eventos/${eventId}`, {
      method: 'DELETE',
    })
    .then(() => {
      // Actualiza el estado para eliminar el evento de la lista
      setEvents(events.filter(event => event.id !== eventId));
      setSelectedEvent(null); // Resetea el evento seleccionado
      setShowModal(false); // Cierra el modal
    })
    .catch(error => {
      console.error('Error al eliminar evento:', error);
    });
  };  

// Función para editar el evento
const handleEdit = (eventId) => {
    const eventoActual = events.find(event => event.id === eventId);
    if (eventoActual) {
      setNewEvent({
        title: eventoActual.title,
        startDate: eventoActual.start.toISOString().split('T')[0],
        endDate: eventoActual.end.toISOString().split('T')[0],
        startTime: eventoActual.start.toTimeString().split(' ')[0], // Obtener solo la hora
        endTime: eventoActual.end.toTimeString().split(' ')[0],
        telefono: eventoActual.telefono,
      });
      setShowInput(true); // Muestra el formulario de entrada para editar
    }
  };
  

  return (
    <div style={{ height: 500 }}>
      <h2>Calendario de Eventos</h2>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        messages={messages}
      />
      {showInput && (
        <div className="centered-form">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Agregar Evento</h2>

          <div>
            <label>Título del evento:</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
              className="form-control"
            />
          </div>

          <div>
            <label>Fecha de inicio:</label>
            <input
              type="date"
              value={newEvent.startDate}
              onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
              required
              className="form-control"
            />
          </div>

          <div>
            <label>Hora de inicio:</label>
            <input
              type="time"
              value={newEvent.startTime}
              onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
              required
              className="form-control"
            />
          </div>

          <div>
            <label>Fecha de fin:</label>
            <input
              type="date"
              value={newEvent.endDate}
              onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              required
              className="form-control"
            />
          </div>

          <div>
            <label>Hora de fin:</label>
            <input
              type="time"
              value={newEvent.endTime}
              onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
              required
              className="form-control"
            />
          </div>

          <div>
            <label>Telefono:</label>
            <input
              type="text"
              value={newEvent.telefono}
              onChange={(e) => setNewEvent({ ...newEvent, telefono: e.target.value })}
              required
              className="form-control"
            />
          </div>
            <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary mt-3">Agregar Evento</button>
                <button className="btn btn-secondary mt-3" onClick={handleClose}>X</button>
            </div>
          
        </form>
      </div>
    </div>
      )}

{/* Modal para mostrar detalles del evento */}
<Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Detalles del Evento</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedEvent && (
      <>
        <p><strong>Nombre:</strong> {selectedEvent.title}</p>
        <p><strong>Fecha de Inicio:</strong> {selectedEvent.start.toString()}</p>
        <p><strong>Fecha de Fin:</strong> {selectedEvent.end.toString()}</p>
        <p><strong>Telefono:</strong> {selectedEvent.telefono}</p>
        {/* Botones para eliminar y editar */}
        <button className="btn btn-danger" onClick={() => handleDelete(selectedEvent.id)}>Eliminar</button>
        <button className="btn btn-primary" onClick={() => handleEdit(selectedEvent.id)}>Editar</button>
      </>
    )}
  </Modal.Body>
  <Modal.Footer>
    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
  </Modal.Footer>
</Modal>
    </div>
  );
};



export default CalendarComponent;
