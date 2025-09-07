// src/components/ActivityDetails.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importa axios
import './ActivityDetails.css';

export const ActivityDetails = ({ activities }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const activity = activities.find(act => act.id === parseInt(id));

  if (!activity) {
    return <div>Actividad no encontrada.</div>;
  }

  // Obtener datos del usuario autenticado
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [nombre, setNombre] = useState(user.nombre || '');
  const [apellido, setApellido] = useState(user.apellido || '');
  const [dni, setDni] = useState(user.dni || '');
  const [telefono, setTelefono] = useState(user.telefono || '');
  const [email, setEmail] = useState(user.email || '');
  const [codigoPago, setCodigoPago] = useState('');
  const [reservaCreada, setReservaCreada] = useState(false);

  const handleReserva = async (e) => {
    e.preventDefault();
    // Simular generación de código de pago
    const codigo = 'PAGO-' + Math.floor(Math.random() * 90000 + 10000);
    setCodigoPago(codigo);

    // Crear reserva en backend (sin acreditar pago aún)
    try {
      const response = await axios.post('http://localhost:3001/reservations', {
        activityId: activity.id,
        nombre,
        apellido,
        dni,
        telefono,
        email,
        codigoPago: codigo,
        status: 'pendiente'
      });
      setReservaCreada(true);
      alert(`Reserva generada. Código de pago: ${codigo}. Cuando se acredite el pago, la reserva se completará.`);
      // Opcional: guardar reserva en localStorage
      const currentReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      localStorage.setItem('reservations', JSON.stringify([...currentReservations, response.data]));
    } catch (error) {
      alert('Error al crear la reserva.');
    }
  };

  return (
    <div className="activity-details-container">
      <h2>{activity.title}</h2>
      <img src={activity.photoUrl} alt={activity.title} className="activity-image" />
        {/* Descripción detallada: todas las líneas de la descripción */}
        <div className="activity-description-detail">
          {activity.description.split('\n').map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
  <p><strong>Precio:</strong> ${activity.price}</p>
  <p><strong>Disponibilidad:</strong> {activity.availability}</p>
      <form onSubmit={handleReserva} className="reservation-form" style={{display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto'}}>
        <h3>Formulario de Reserva</h3>
        <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
        <input type="text" placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} required />
        <input type="text" placeholder="DNI" value={dni} onChange={e => setDni(e.target.value)} required />
        <input type="text" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} required />
        <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required />
        <button type="submit" className="pay-button" disabled={reservaCreada} style={{marginTop: '16px'}}>
          Generar Reserva
        </button>
        <button type="button" className="cancel-button" style={{marginTop: '8px'}} onClick={() => navigate('/activities')}>
          Volver
        </button>
      </form>
      {codigoPago && (
        <div className="codigo-pago-info">
          <p><strong>Código de pago generado:</strong> {codigoPago}</p>
          <p>La reserva se completará cuando se acredite el pago. (Simulación)</p>
        </div>
      )}
    </div>
  );
};