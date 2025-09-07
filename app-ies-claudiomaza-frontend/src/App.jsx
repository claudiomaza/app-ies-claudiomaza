// src/App.jsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import { ActivitiesList } from './components/ActivitiesList';
import { ActivityDetails } from './components/ActivityDetails';
import { activities } from './data';
import './App.css';
import { AuthContext, AuthProvider } from './AuthContext'; // Importa el AuthProvider

const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext); // Usa el contexto para el estado

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/activities"
          element={isAuthenticated ? <ActivitiesList activities={activities} /> : <Navigate to="/login" />}
        />
        <Route
          path="/activity/:id"
          element={isAuthenticated ? <ActivityDetails activities={activities} /> : <Navigate to="/login" />}
        />
      </Routes>
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