// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { AuthContext } from '../AuthContext'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}`);
      const users = await res.json();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        login(user);
        navigate('/activities');
      } else {
        setError('Correo o contraseña incorrectos.');
      }
    } catch (err) {
      setError('Error de conexión al servidor.');
      console.error('Error de login:', err);
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
      <p>¿No tienes una cuenta? <Link to="/">Regístrate</Link></p>
    </div>
  );
};

export default Login;