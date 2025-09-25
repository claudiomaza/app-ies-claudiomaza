import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import './ReservationList.css';

const ReservationList = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/reservations/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setReservations(data);
        }
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
      }
    };

    if (user) {
      fetchReservations();
    }
  }, [user]);

  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Completada'
  };

  const statusColors = {
    pending: '#f59e0b',
    confirmed: '#10b981',
    cancelled: '#ef4444',
    completed: '#6366f1'
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="reservation-list">
      <h2>Mis Reservas</h2>
      <div className="reservation-grid">
        {reservations.map(reservation => (
          <div key={reservation.id} className="reservation-card">
            <div className="reservation-info">
              <h3>{reservation.activity?.title}</h3>
              <div className="reservation-details">
                <p><strong>Código:</strong> {reservation.confirmationCode}</p>
                <p><strong>Fecha:</strong> {formatDate(reservation.date)}</p>
                <p>
                  <strong>Estado:</strong>
                  <span className="status-badge" style={{backgroundColor: statusColors[reservation.status]}}>
                    {statusLabels[reservation.status]}
                  </span>
                </p>
                <p><strong>Creada:</strong> {formatDate(reservation.createdAt)}</p>
              </div>
            </div>
            <div className="activity-info">
              {reservation.activity?.photos && reservation.activity.photos[0] && (
                <img 
                  src={reservation.activity.photos[0]} 
                  alt={reservation.activity.title}
                  className="activity-photo"
                />
              )}
              <div className="activity-details">
                <p><strong>Horario:</strong> {reservation.activity?.time}</p>
                <p><strong>Ubicación:</strong> {reservation.activity?.location.direccion}</p>
                <p><strong>Precio:</strong> ${reservation.activity?.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationList;