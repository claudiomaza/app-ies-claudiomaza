// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { AuthContext } from '../AuthContext'; 

const Login = () => {
  const handleSocialLogin = () => {
    // Simular inicio de sesión con redes sociales
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    alert('Inicio de sesión con redes sociales simulado. Redirigiendo...');
    navigate('/activities');
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext); 

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
      setIsAuthenticated(true); // Actualiza el estado global
      alert('¡Inicio de sesión exitoso!');
      console.log('Login exitoso. El estado es true.');

      setTimeout(() => {
          navigate('/activities');
      }, 100); // 100 milisegundos de retraso
    } else {
      alert('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Iniciar Sesión</button>
      </form>
      <div className="social-login">
        <button onClick={handleSocialLogin}>Iniciar sesión con Google</button>
        <button onClick={handleSocialLogin}>Iniciar sesión con Facebook</button>
      </div>
      <p>¿No tienes una cuenta? <Link to="/">Regístrate</Link></p>
    </div>
  );
};

export default Login;