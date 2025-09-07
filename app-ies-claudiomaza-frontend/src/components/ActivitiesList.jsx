// src/components/ActivitiesList.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; 
import './ActivitiesList.css'; 

export const ActivitiesList = ({ activities }) => {

  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="activities-list-container">
      <h2>Actividades Disponibles</h2>
      <button onClick={handleLogout} style={{ marginBottom: '20px' }}>Cerrar Sesión</button>
      <div className="activities-grid">
        {activities.map(activity => (
          <div key={activity.id} className="activity-card">
            <img src={activity.photoUrl} alt={activity.title} className="activity-image" />
            <div className="activity-info">
              <h3>{activity.title}</h3>
              <p className="activity-description">{activity.description}</p>
              <p className="activity-price">Precio: ${activity.price}</p>
              <p className="activity-availability">{activity.availability}</p>
              <Link to={`/activity/${activity.id}`} className="select-button">
                Seleccionar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

