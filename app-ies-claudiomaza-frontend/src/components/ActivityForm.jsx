import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './ActivityForm.css';

const ActivityForm = () => {
  const navigate = useNavigate();
  const [activity, setActivity] = useState({
    title: '',
    description: '',
    price: '',
    time: '',
    daysOfWeek: [],
    startDate: null,
    endDate: null,
    dates: [],
    authorId: null,
    authorUsername: '',
    location: {
      direccion: '',
      departamento: '',
      provincia: ''
    }
  });
  const [errors, setErrors] = useState({});

  const diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  const handleDayToggle = (day) => {
    setActivity(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      options.push(`${hour}:00`);
    }
    return options;
  };

  const generateDatesArray = () => {
    if (!activity.startDate || !activity.endDate) return [];
    
    const dates = [];
    const current = new Date(activity.startDate);
    const end = new Date(activity.endDate);
    
    while (current <= end) {
      if (activity.daysOfWeek.includes(
        current.toLocaleString('es-ES', { weekday: 'long' })
      )) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!activity.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    
    if (!activity.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (!activity.price || activity.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    
    if (!activity.time) {
      newErrors.time = 'Debe seleccionar un horario';
    }
    
    if (activity.daysOfWeek.length === 0) {
      newErrors.daysOfWeek = 'Debe seleccionar al menos un día';
    }
    
    if (!activity.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }
    
    if (!activity.endDate) {
      newErrors.endDate = 'La fecha de fin es requerida';
    }
    
    if (!activity.location.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }
    
    if (!activity.location.departamento.trim()) {
      newErrors.departamento = 'El departamento es requerido';
    }
    
    if (!activity.location.provincia.trim()) {
      newErrors.provincia = 'La provincia es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const dates = generateDatesArray();
    if (dates.length === 0) {
      setErrors({
        dates: 'No hay fechas disponibles para los días seleccionados en ese rango'
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...activity,
          dates: dates.map(date => date.toISOString().split('T')[0])
        }),
      });

      if (!response.ok) throw new Error('Error al crear la actividad');
      
      navigate('/activities');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la actividad');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="activity-form">
      <h2>Nueva Actividad</h2>

      {errors.dates && <div className="error-message">{errors.dates}</div>}
      
      <div className="form-group">
        <label>Título</label>
        <input
          type="text"
          value={activity.title}
          onChange={(e) => setActivity({...activity, title: e.target.value})}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea
          value={activity.description}
          onChange={(e) => setActivity({...activity, description: e.target.value})}
          className={errors.description ? 'error' : ''}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label>Precio</label>
        <input
          type="number"
          value={activity.price}
          onChange={(e) => setActivity({...activity, price: e.target.value})}
          min="0"
          step="0.01"
          className={errors.price ? 'error' : ''}
        />
        {errors.price && <span className="error-message">{errors.price}</span>}
      </div>

      <div className="form-group">
        <label>Horario (formato 24h)</label>
        <select
          value={activity.time}
          onChange={(e) => setActivity({...activity, time: e.target.value})}
          className={errors.time ? 'error' : ''}
        >
          <option value="">Seleccionar horario</option>
          {generateTimeOptions().map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
        {errors.time && <span className="error-message">{errors.time}</span>}
      </div>

      <div className="form-group">
        <label>Días de la semana</label>
        <div className="days-checkboxes">
          {diasSemana.map(day => (
            <label key={day} className="day-checkbox">
              <input
                type="checkbox"
                checked={activity.daysOfWeek.includes(day)}
                onChange={() => handleDayToggle(day)}
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Periodo de la actividad</label>
        <div className="date-range">
          <DatePicker
            selected={activity.startDate}
            onChange={(date) => setActivity({...activity, startDate: date})}
            selectsStart
            startDate={activity.startDate}
            endDate={activity.endDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Fecha de inicio"
            minDate={new Date()}
            required
          />
          <DatePicker
            selected={activity.endDate}
            onChange={(date) => setActivity({...activity, endDate: date})}
            selectsEnd
            startDate={activity.startDate}
            endDate={activity.endDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Fecha de fin"
            minDate={activity.startDate}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Ubicación</label>
        <input
          type="text"
          placeholder="Dirección"
          value={activity.location.direccion}
          onChange={(e) => setActivity({
            ...activity,
            location: {...activity.location, direccion: e.target.value}
          })}
          required
        />
        <input
          type="text"
          placeholder="Departamento"
          value={activity.location.departamento}
          onChange={(e) => setActivity({
            ...activity,
            location: {...activity.location, departamento: e.target.value}
          })}
          required
        />
        <input
          type="text"
          placeholder="Provincia"
          value={activity.location.provincia}
          onChange={(e) => setActivity({
            ...activity,
            location: {...activity.location, provincia: e.target.value}
          })}
          required
        />
      </div>

      <button type="submit">Crear Actividad</button>
    </form>
  );
};

export default ActivityForm;