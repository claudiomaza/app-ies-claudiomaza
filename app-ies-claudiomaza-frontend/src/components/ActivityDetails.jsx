import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import ReservationForm from './ReservationForm';
import axios from 'axios';
import './ActivityDetails.css';

const ActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingReservation, setExistingReservation] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/activities/${id}`);
        setActivity(response.data);
      } catch (error) {
        console.error('Error al obtener la actividad:', error);
        setError('Error al cargar la actividad. Por favor, intente nuevamente.');
      }
    };

    const checkReservation = async () => {
      if (user && activity) {
        try {
          const headers = { 'Authorization': 'Bearer ' + btoa(JSON.stringify(user)) };
          const response = await axios.get(
            `http://localhost:3001/users/reservations/${user.id}`,
            { headers }
          );
          const userReservations = response.data;
          const reservation = userReservations.find(r => r.activityId === parseInt(id));
          if (reservation) {
            setExistingReservation(reservation);
          }
        } catch (error) {
          if (error.response?.status === 401) {
            navigate('/login');
          } else {
            console.error('Error al verificar reserva:', error);
          }
        }
      }
      setLoading(false);
    };

    fetchActivity();
    checkReservation();
  }, [id, user]);

  const handleReservationSubmit = (newReservation) => {
    setExistingReservation(newReservation);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!activity) {
    return <div className="error">La actividad no existe.</div>;
  }

  return (
    <div className="activity-details">
      <h2>{activity.title}</h2>
      <div className="info-section">
        <div className="photos">
          {activity.photos.map((photo, index) => (
            <img key={index} src={photo} alt={`${activity.title} - ${index + 1}`} />
          ))}
        </div>
        <p className="description">{activity.description}</p>
        <p><strong>Precio:</strong> ${activity.price}</p>
        <p><strong>Horario:</strong> {activity.time}</p>
        <p><strong>Días:</strong> {activity.daysOfWeek.join(', ')}</p>
        <p><strong>Ubicación:</strong> {activity.location.direccion}, {activity.location.departamento}, {activity.location.provincia}</p>
      </div>

      {user ? (
        <ReservationForm
          activity={activity}
          existingReservation={existingReservation}
          onSubmit={handleReservationSubmit}
        />
      ) : (
        <div className="login-prompt">
          <p>Debes iniciar sesión para reservar esta actividad.</p>
          <button onClick={() => navigate('/login')} className="primary-button">
            Iniciar Sesión
          </button>
        </div>
      )}

      <button type="button" className="secondary-button" onClick={() => navigate('/activities')}>
        Volver al Listado
      </button>
    </div>
  );
};

export default ActivityDetails;