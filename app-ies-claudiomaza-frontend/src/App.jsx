// src/App.jsx
import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import { ActivitiesList } from './components/ActivitiesList';
import ActivityDetails from './components/ActivityDetails';
import Profile from './components/Profile';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Cargar actividades siempre, no solo cuando está autenticado
    fetch('http://localhost:3001/activities')
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(() => setActivities([]));
  }, []); // Solo se ejecuta una vez al montar el componente

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/activities" className="nav-brand">
            IES App
          </Link>
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/activities" className="nav-button activities">
                  Actividades
                </Link>
                <Link to="/profile" className="nav-button profile">
                  Mi Perfil
                </Link>
                <button onClick={handleLogout} className="nav-button logout">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="nav-link">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/activities" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/activities" element={<ActivitiesList activities={activities} />} />
          <Route path="/activity/:id" element={<ActivityDetails />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/activities" />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider> {/* Envuelve la aplicación con el proveedor */}
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;