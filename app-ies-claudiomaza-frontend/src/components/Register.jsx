// src/components/Register.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

import { AuthContext } from '../AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showVerification, setShowVerification] = useState(false);
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

  const handleVerification = (e) => {
    e.preventDefault();
    // Validar el código de verificación (TAREA3)
    if (verificationCode === PREDEFINED_CODE) {
      // Almacenar usuario en la memoria del navegador (localStorage)
      localStorage.setItem('user', JSON.stringify({ email, password }));
      localStorage.setItem('isAuthenticated', 'true');
      alert('¡Registro y verificación exitosos! Redirigiendo a la pantalla de inicio.');
      navigate('/activities'); // Redirige a la lista de actividades
    } else {
      alert('Código de verificación incorrecto. Inténtelo de nuevo.');
    }
  };

  const handleSocialLogin = () => {
    // Simular inicio de sesión con redes sociales (TAREA4)
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    alert('Inicio de sesión con redes sociales simulado. Redirigiendo...');
    navigate('/activities');
  };

  return (
    <div className="auth-container">
      <h2>Registro de Usuario</h2>
      {!showVerification ? (
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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