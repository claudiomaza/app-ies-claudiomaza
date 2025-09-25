import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [hostingActivities, setHostingActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Cargar reservas
        const reservationsResponse = await fetch(`http://localhost:3001/reservations?userId=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${btoa(JSON.stringify(user))}`
          }
        });
        
        if (!reservationsResponse.ok) throw new Error('Error al cargar reservas');
        const reservationsData = await reservationsResponse.json();

        // Cargar detalles de las actividades reservadas
        const reservedActivities = await Promise.all(
          reservationsData.map(async (reservation) => {
            const activityResponse = await fetch(`http://localhost:3001/activities/${reservation.activityId}`);
            if (activityResponse.ok) {
              const activity = await activityResponse.json();
              return { ...reservation, activity };
            }
            return null;
          })
        );

        setReservations(reservedActivities.filter(Boolean));

        // Cargar actividades donde el usuario es anfitrión
        const hostingResponse = await fetch(`http://localhost:3001/activities?authorId=${user.id}`);
        if (hostingResponse.ok) {
          const hostingData = await hostingResponse.json();
          setHostingActivities(hostingData);
        }

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Mi Perfil</h2>
      
      <div className="user-info">
        <h3>Información Personal</h3>
        <p><strong>Usuario:</strong> {user.username}</p>
        <p><strong>Nombre:</strong> {user.nombre}</p>
        <p><strong>Apellido:</strong> {user.apellido}</p>
        <p><strong>DNI:</strong> {user.dni}</p>
        <p><strong>Teléfono:</strong> {user.telefono}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="actions-section">
        <button 
          onClick={() => navigate('/activities/new')} 
          className="create-activity-button"
        >
          Crear Nueva Actividad
        </button>
      </div>

      <div className="hosting-section">
        <h3>Mis Actividades como Anfitrión</h3>
        {hostingActivities.length === 0 ? (
          <p>No tienes actividades creadas</p>
        ) : (
          <div className="activities-grid">
            {hostingActivities.map(activity => (
              <div key={activity.id} className="activity-card">
                <h4>{activity.title}</h4>
                <p><strong>Horario:</strong> {activity.time}</p>
                <p><strong>Días:</strong> {activity.daysOfWeek.join(', ')}</p>
                <p><strong>Precio:</strong> ${activity.price}</p>
                <Link to={`/activities/${activity.id}/edit`} className="edit-button">
                  Editar
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="reservations-section">
        <h3>Mis Reservas</h3>
        {reservations.length === 0 ? (
          <p>No tienes reservas activas</p>
        ) : (
          <div className="reservations-grid">
            {reservations.map(reservation => (
              <div key={reservation.id} className="reservation-card">
                <h4>{reservation.activity.title}</h4>
                <p><strong>Fecha:</strong> {new Date(reservation.date).toLocaleDateString('es-AR')}</p>
                <p><strong>Horario:</strong> {reservation.activity.time}</p>
                <p><strong>Estado:</strong> 
                  <span className={`status-badge ${reservation.status}`}>
                    {reservation.status === 'pending' ? 'Pendiente' :
                     reservation.status === 'confirmed' ? 'Confirmada' :
                     reservation.status === 'completed' ? 'Completada' : 'Cancelada'}
                  </span>
                </p>
                <p><strong>Precio:</strong> ${reservation.activity.price}</p>
                <Link to={`/activity/${reservation.activity.id}`} className="view-button">
                  Ver Detalles
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;