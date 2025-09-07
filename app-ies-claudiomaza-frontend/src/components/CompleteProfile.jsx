// src/components/CompleteProfile.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = ({ initialData }) => {
  const [nombre, setNombre] = useState(initialData.nombre || '');
  const [apellido, setApellido] = useState(initialData.apellido || '');
  const [dni, setDni] = useState(initialData.dni || '');
  const [telefono, setTelefono] = useState(initialData.telefono || '');
  const [email, setEmail] = useState(initialData.email || '');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/usuarios', {
        nombre,
        apellido,
        dni,
        telefono,
        email,
        social: true
      });
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('isAuthenticated', 'true');
      alert('Perfil completado correctamente.');
      navigate('/activities');
    } catch (error) {
      alert('Error al completar el perfil.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Completa tu perfil</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
        <input type="text" placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value)} required />
        <input type="text" placeholder="DNI" value={dni} onChange={e => setDni(e.target.value)} required />
        <input type="text" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} required />
        <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required />
        <button type="submit">Guardar y Continuar</button>
      </form>
    </div>
  );
};

export default CompleteProfile;
