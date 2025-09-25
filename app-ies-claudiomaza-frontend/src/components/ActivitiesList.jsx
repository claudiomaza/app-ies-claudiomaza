import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ActivitiesList.css';

const diasSemana = [
  { value: 'Lunes', label: 'Lunes' },
  { value: 'Martes', label: 'Martes' },
  { value: 'Miércoles', label: 'Miércoles' },
  { value: 'Jueves', label: 'Jueves' },
  { value: 'Viernes', label: 'Viernes' },
  { value: 'Sábado', label: 'Sábado' },
  { value: 'Domingo', label: 'Domingo' }
];

const generateTimeOptions = () => {
  const options = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    options.push(`${hour}:00`);
  }
  return options;
};

export const ActivitiesList = ({ activities = [] }) => {
  const [filteredActivities, setFilteredActivities] = useState(activities);
  const [filters, setFilters] = useState({
    provincia: '',
    departamento: '',
    daysOfWeek: [],
    authorUsername: '',
    minPrice: '',
    maxPrice: '',
    startTime: '',
    endTime: ''
  });

  const timeOptions = generateTimeOptions();

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let filtered = [...activities];

    if (filters.startTime || filters.endTime) {
      filtered = filtered.filter(activity => {
        if (!activity.time) return false;
        const [activityHour] = activity.time.split(':').map(Number);
        const startHour = filters.startTime ? parseInt(filters.startTime) : 0;
        const endHour = filters.endTime ? parseInt(filters.endTime) : 23;
        return activityHour >= startHour && activityHour <= endHour;
      });
    }

    if (filters.daysOfWeek.length > 0) {
      filtered = filtered.filter(activity => {
        if (!activity.daysOfWeek || !Array.isArray(activity.daysOfWeek)) return false;
        return filters.daysOfWeek.some(day => activity.daysOfWeek.includes(day));
      });
    }

    if (filters.provincia) {
      filtered = filtered.filter(activity => activity.location?.provincia === filters.provincia);
    }

    if (filters.departamento) {
      filtered = filtered.filter(activity => activity.location?.departamento === filters.departamento);
    }

    if (filters.authorUsername) {
      filtered = filtered.filter(activity => activity.authorUsername === filters.authorUsername);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(activity => Number(activity.price) >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(activity => Number(activity.price) <= Number(filters.maxPrice));
    }

    setFilteredActivities(filtered);
  }, [activities, filters]);

  const provincias = Array.from(new Set(activities.map(a => a.location?.provincia).filter(Boolean)));
  const departamentos = Array.from(new Set(activities.map(a => a.location?.departamento).filter(Boolean)));
  const authors = Array.from(new Set(activities.map(a => a.authorUsername).filter(Boolean)));

  return (
    <div className="activities-list-container">
      <h2>Actividades Disponibles</h2>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Horario:</label>
            <div className="time-range">
              <select 
                value={filters.startTime}
                onChange={e => handleFilterChange('startTime', e.target.value)}
                className="time-select"
              >
                <option value="">Desde</option>
                {timeOptions.map(time => (
                  <option key={time} value={time.split(':')[0]}>
                    {time}
                  </option>
                ))}
              </select>
              <span>-</span>
              <select
                value={filters.endTime}
                onChange={e => handleFilterChange('endTime', e.target.value)}
                className="time-select"
              >
                <option value="">Hasta</option>
                {timeOptions.map(time => (
                  <option key={time} value={time.split(':')[0]}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-group">
            <label>Días disponibles:</label>
            <div className="days-checkboxes">
              {diasSemana.map(({ value, label }) => (
                <label key={value} className="day-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.daysOfWeek.includes(value)}
                    onChange={e => {
                      const newDays = e.target.checked
                        ? [...filters.daysOfWeek, value]
                        : filters.daysOfWeek.filter(d => d !== value);
                      handleFilterChange('daysOfWeek', newDays);
                    }}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Provincia:</label>
            <select
              value={filters.provincia}
              onChange={e => handleFilterChange('provincia', e.target.value)}
            >
              <option value="">Todas</option>
              {provincias.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Departamento:</label>
            <select
              value={filters.departamento}
              onChange={e => handleFilterChange('departamento', e.target.value)}
            >
              <option value="">Todos</option>
              {departamentos.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Autor:</label>
            <select
              value={filters.authorUsername}
              onChange={e => handleFilterChange('authorUsername', e.target.value)}
            >
              <option value="">Todos</option>
              {authors.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Precio:</label>
            <div className="price-range">
              <input
                type="number"
                value={filters.minPrice}
                onChange={e => handleFilterChange('minPrice', e.target.value)}
                placeholder="Mínimo"
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={e => handleFilterChange('maxPrice', e.target.value)}
                placeholder="Máximo"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="activities-grid">
        {filteredActivities.map(activity => (
          <div key={activity.id} className="activity-card">
            {activity.photos?.[0] && (
              <img
                src={activity.photos[0]}
                alt={activity.title}
                className="activity-image"
              />
            )}
            <div className="activity-info">
              <h3>{activity.title}</h3>
              <p className="description">
                {activity.description?.split('\n')[0]}
              </p>
              <p><strong>Autor:</strong> {activity.authorUsername}</p>
              <p><strong>Precio:</strong> ${activity.price}</p>
              <p><strong>Días:</strong> {activity.daysOfWeek?.join(', ')}</p>
              <p><strong>Horario:</strong> {activity.time}</p>
              {activity.location && (
                <p><strong>Ubicación:</strong> {activity.location.provincia}, {activity.location.departamento}</p>
              )}
              <Link to={`/activity/${activity.id}`} className="select-button">
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};