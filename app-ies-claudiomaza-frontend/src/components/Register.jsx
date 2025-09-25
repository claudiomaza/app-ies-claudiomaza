import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    password: ''
  });
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const PREDEFINED_CODE = '123456';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setShowVerification(true);
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    
    if (verificationCode !== PREDEFINED_CODE) {
      alert('Código de verificación incorrecto');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/users', {
        ...formData,
        social: false
      });

      if (response.status === 201) {
        login(response.data);
        navigate('/activities');
      } else {
        throw new Error('Error en el registro');
      }
    } catch (error) {
      alert('Error al registrar usuario. Por favor, intente nuevamente.');
      setShowVerification(false);
    }
  };

  if (showVerification) {
    return (
      <div className="auth-container">
        <h2>Verificación</h2>
        <form onSubmit={handleVerification}>
          <p>Se ha enviado un código de verificación a su correo electrónico.</p>
          <input
            type="text"
            placeholder="Código de verificación"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <button type="submit">Verificar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="dni"
          placeholder="DNI"
          value={formData.dni}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Registrar</button>
      </form>
      <p>¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></p>
    </div>
  );
};

export default Register;