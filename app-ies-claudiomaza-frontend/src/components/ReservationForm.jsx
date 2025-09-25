import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import DatePicker from 'react-datepicker';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import './ReservationForm.css';

const ReservationForm = ({ activity, onSubmit, existingReservation }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    fechaSeleccionada: null,
    horarioSeleccionado: ''
  });
  
  const [availableHours, setAvailableHours] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        dni: user.dni || '',
        telefono: user.telefono || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (activity && formData.fechaSeleccionada) {
      const selectedDate = formData.fechaSeleccionada;
      const dayOfWeek = selectedDate.toLocaleString('es-ES', { weekday: 'long' });
      
      if (activity.daysOfWeek.includes(dayOfWeek)) {
        const [hour] = activity.time.split(':');
        setAvailableHours([activity.time]);
        setFormData(prev => ({
          ...prev,
          horarioSeleccionado: activity.time
        }));
      } else {
        setAvailableHours([]);
        setFormData(prev => ({
          ...prev,
          horarioSeleccionado: ''
        }));
      }
    }
  }, [activity, formData.fechaSeleccionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fechaSeleccionada || !formData.horarioSeleccionado) {
      setErrors({ submit: 'Debes seleccionar fecha y horario' });
      return;
    }

    try {
      setIsSubmitting(true);
      const reservationData = {
        activityId: activity.id,
        userId: user.id,
        ...formData,
        date: formData.fechaSeleccionada.toISOString().split('T')[0],
        time: formData.horarioSeleccionado,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:3001/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${btoa(JSON.stringify(user))}`
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        throw new Error('Error al crear la reserva');
      }

      const newReservation = await response.json();
      setSuccessMessage('Reserva creada exitosamente.');
      
      setTimeout(() => {
        onSubmit && onSubmit(newReservation);
      }, 2000);

    } catch (error) {
      setErrors({
        submit: 'Error al crear la reserva. Por favor, intente nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (existingReservation) {
    return (
      <div className="reservation-status">
        <h3>Estado de tu Reserva</h3>
        <div className="status-info">
          <p>
            <strong>Estado:</strong>
            <span className={`status-badge ${existingReservation.status}`}>
              {existingReservation.status === 'pending' ? 'Pendiente' :
               existingReservation.status === 'confirmed' ? 'Confirmada' :
               existingReservation.status === 'completed' ? 'Completada' : 'Cancelada'}
            </span>
          </p>
          <p><strong>Fecha:</strong> {new Date(existingReservation.date).toLocaleDateString('es-AR')}</p>
          <p><strong>Horario:</strong> {existingReservation.time}</p>
          <p><strong>Monto:</strong> ${activity.price}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="reservation-form">
      <h3>Formulario de Reserva</h3>
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="form-group">
        <label>Fecha</label>
        <DatePicker
          selected={formData.fechaSeleccionada}
          onChange={date => setFormData({...formData, fechaSeleccionada: date})}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          includeDates={activity.dates?.map(d => new Date(d))}
          placeholderText="Selecciona una fecha"
          required
        />
      </div>

      {availableHours.length > 0 && (
        <div className="form-group">
          <label>Horario Disponible</label>
          <select
            value={formData.horarioSeleccionado}
            onChange={(e) => setFormData({...formData, horarioSeleccionado: e.target.value})}
            required
          >
            <option value="">Seleccionar horario</option>
            {availableHours.map(hour => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label>Nombre</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Apellido</label>
        <input
          type="text"
          value={formData.apellido}
          onChange={(e) => setFormData({...formData, apellido: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>DNI</label>
        <input
          type="text"
          value={formData.dni}
          onChange={(e) => setFormData({...formData, dni: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="text"
          value={formData.telefono}
          onChange={(e) => setFormData({...formData, telefono: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <div className="price-summary">
        <h4>Resumen</h4>
        <p><strong>Precio:</strong> ${activity.price}</p>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;