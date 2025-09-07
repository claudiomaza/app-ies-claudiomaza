// src/components/ActivityDetails.jsx
import React from 'react';
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

  const handlePaymentSimulation = async (e) => {
    e.preventDefault();
    try {
      // Hace una llamada POST al servidor simulado
      const response = await axios.post('http://localhost:3001/reservations', {
        activityId: activity.id,
        paymentMethod: 'credit_card' // Simula un método de pago
      });

      // La respuesta del servidor contendrá el confirmationCode
      console.log('Reserva confirmada:', response.data);
      alert(`¡Reserva confirmada! Código de confirmación: ${response.data.confirmationCode}`);

      // Almacena la reserva en el localStorage si lo deseas
      const currentReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      localStorage.setItem('reservations', JSON.stringify([...currentReservations, response.data]));

      // Redirige al usuario
      navigate('/activities');
    } catch (error) {
      console.error('Error al hacer la reserva:', error);
      alert('Hubo un error al procesar la reserva. Intente de nuevo.');
    }
  };

  return (
    <div className="activity-details-container">
      {/* ...el resto del código del componente */}
      <form onSubmit={handlePaymentSimulation} className="payment-form">
        <h3>Detalles de Pago</h3>
        <input type="text" placeholder="Número de tarjeta de prueba" required />
        <input type="text" placeholder="Fecha de vencimiento (MM/AA)" required />
        <input type="text" placeholder="CVC" required />
        <button type="submit" className="pay-button">
          Proceder al Pago
        </button>
        <button type="button" className="cancel-button" style={{marginLeft: '10px'}} onClick={() => navigate('/activities')}>
          Cancelar y Volver
        </button>
      </form>
    </div>
  );
};