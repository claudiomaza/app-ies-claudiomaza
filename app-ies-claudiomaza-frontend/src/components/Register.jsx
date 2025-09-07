// src/components/Register.jsx
import React, { useState, useContext } from 'react';
import CompleteProfile from './CompleteProfile';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

import { AuthContext } from '../AuthContext';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [socialData, setSocialData] = useState({});
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();
  const PREDEFINED_CODE = '123456'; // Código de verificación de prueba
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleRegister = (e) => {
    e.preventDefault();
    // Simular envío de código de verificación (TAREA2)
    console.log(`Código de verificación enviado a ${email}. Código de prueba: ${PREDEFINED_CODE}`);
    setShowVerification(true);
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    // Validar el código de verificación (TAREA3)
    if (verificationCode === PREDEFINED_CODE) {
      try {
        // Registrar usuario en el backend
        const response = await axios.post('http://localhost:3001/usuarios', {
          nombre,
          apellido,
          dni,
          telefono,
          email,
          password
        });
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        alert('¡Registro y verificación exitosos! Redirigiendo a la pantalla de inicio.');
        navigate('/activities');
      } catch (error) {
        alert('Error al registrar usuario en el backend.');
      }
    } else {
      alert('Código de verificación incorrecto. Inténtelo de nuevo.');
    }
  };

  const handleSocialLogin = () => {
    // Simular obtención de datos desde redes sociales
    const socialUser = {
      email: '', // Simular que solo se obtiene el email
      nombre: '',
      apellido: '',
      dni: '',
      telefono: ''
    };
    setSocialData(socialUser);
    setShowCompleteProfile(true);
  };

  return (
    <div className="auth-container">
      <h2>Registro de Usuario</h2>
      {showCompleteProfile ? (
        <CompleteProfile initialData={socialData} />
      ) : !showVerification ? (
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={e => setApellido(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="DNI"
            value={dni}
            onChange={e => setDni(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Registrar</button>
        </form>
      ) : (
        <form onSubmit={handleVerification}>
          <p>Ingresa el código de verificación enviado a tu correo.</p>
          <input
            type="text"
            placeholder="Código de verificación"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <button type="submit">Validar Código</button>
        </form>
      )}

      <div className="social-login">
        <button onClick={handleSocialLogin}>Registrarse con Google</button>
        <button onClick={handleSocialLogin}>Registrarse con Facebook</button>
      </div>
      <p>¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link></p>
    </div>
  );
};

export default Register;