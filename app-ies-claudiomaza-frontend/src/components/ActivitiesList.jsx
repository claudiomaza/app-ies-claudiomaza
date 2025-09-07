import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './ActivitiesList.css';

// src/components/ActivitiesList.jsx
export const ActivitiesList = ({ activities }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedLocation, setSelectedLocation] = useState('Todas');
  // Obtener categorías únicas
  const categories = ['Todas', ...Array.from(new Set(activities.map(a => a.category).filter(Boolean)))];
  // Obtener ubicaciones únicas
  const locations = ['Todas', ...Array.from(new Set(activities.map(a => a.location).filter(Boolean)))];

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Filtrar actividades por categoría y ubicación
  let filteredActivities = activities;
  if (selectedCategory !== 'Todas') {
    filteredActivities = filteredActivities.filter(a => a.category === selectedCategory);
  }
  if (selectedLocation !== 'Todas') {
    filteredActivities = filteredActivities.filter(a => a.location === selectedLocation);
  }

  return (
    <div className="activities-list-container">
      <h2>Actividades Disponibles</h2>
      <button onClick={handleLogout} style={{ marginBottom: '20px' }}>Cerrar Sesión</button>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
        <div>
          <label htmlFor="category-select">Filtrar por categoría: </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location-select">Filtrar por ubicación: </label>
          <select
            id="location-select"
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="activities-grid">
        {filteredActivities.map(activity => (
          <div key={activity.id} className="activity-card">
            <img src={activity.photoUrl} alt={activity.title} className="activity-image" />
            <div className="activity-info">
              <h3>{activity.title}</h3>
                {/* Descripción breve: primera línea de la descripción */}
                <p className="activity-description">
                  {activity.description.split('\n')[0]}
                </p>
              <p className="activity-price">Precio: ${activity.price}</p>
              <p className="activity-availability">{activity.availability}</p>
              <p className="activity-category">Categoría: {activity.category || 'Sin categoría'}</p>
              <Link to={`/activity/${activity.id}`} className="select-button">Seleccionar</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
