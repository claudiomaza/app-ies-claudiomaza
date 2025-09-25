import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';

export const ProfileMenu = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [hostActivities, setHostActivities] = useState([]);
  const [participantActivities, setParticipantActivities] = useState([]);
  const [participantReservations, setParticipantReservations] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Obtener usuario autenticado por DNI
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.dni) return;
      fetch(`http://localhost:3001/users?dni=${userData.dni}`)
        .then(res => res.json())
        .then(users => {
          const u = users[0] || userData;
          setUser(u);
          if (u) {
            fetch(`http://localhost:3001/activities?id=${(u.hostActivities||[]).join('&id=')}`)
              .then(res => res.json())
              .then(setHostActivities);
            fetch(`http://localhost:3001/activities?id=${(u.participantActivities||[]).join('&id=')}`)
              .then(res => res.json())
              .then(setParticipantActivities);
            fetch(`http://localhost:3001/reservations?dni=${u.dni}`)
              .then(res => res.json())
              .then(setParticipantReservations);
          }
        });
    }
  }, [isAuthenticated]);
  // Formulario para editar datos personales
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState({});
  const handleEditUser = () => {
    setEditUser(user);
    setEditMode(true);
  };
  const handleSaveUser = () => {
    fetch(`http://localhost:3001/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editUser)
    }).then(() => {
      setUser(editUser);
      localStorage.setItem('user', JSON.stringify(editUser));
      setEditMode(false);
    });
  };

  // Formulario para agregar actividad como anfitrión
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    price: '',
    dates: [],
    daysOfWeek: [],
    time: '',
    location: { provincia: '', departamento: '', direccion: '' },
    photos: [],
  });

  // Menú emergente para fechas y días
  const handleDateChange = (e) => {
    setNewActivity({ ...newActivity, dates: Array.from(e.target.selectedOptions, opt => opt.value) });
  };
  const handleDaysChange = (e) => {
    setNewActivity({ ...newActivity, daysOfWeek: Array.from(e.target.selectedOptions, opt => opt.value) });
  };
  const handleTimeChange = (e, type) => {
    const [start, end] = newActivity.time.split('-');
    setNewActivity({
      ...newActivity,
      time: type === 'start' ? `${e.target.value}-${end || ''}` : `${start || ''}-${e.target.value}`
    });
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!user) return;
    const activity = {
      ...newActivity,
      authorId: user.id,
      authorUsername: user.username,
      price: Number(newActivity.price),
      dates: Array.isArray(newActivity.dates) ? newActivity.dates : [newActivity.dates],
      daysOfWeek: Array.isArray(newActivity.daysOfWeek) ? newActivity.daysOfWeek : [newActivity.daysOfWeek],
      location: { ...newActivity.location },
      photos: Array.isArray(newActivity.photos) ? newActivity.photos : [newActivity.photos],
      reservations: [],
    };
    fetch('http://localhost:3001/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    })
      .then(res => res.json())
      .then(data => {
        // Actualizar hostActivities del usuario
        fetch(`http://localhost:3001/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hostActivities: [...user.hostActivities, data.id] }),
        }).then(() => window.location.reload());
      });
  };

  if (!isAuthenticated || !user) return <div>Inicia sesión para ver tu perfil.</div>;

  return (
    <div className="profile-menu">
      <h2>Perfil de {user.nombre} {user.apellido}</h2>
      <p><b>DNI:</b> {user.dni}</p>
      <p><b>Teléfono:</b> {user.telefono}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Usuario:</b> {user.username}</p>
      <button onClick={handleEditUser}>Editar datos</button>
      {editMode && (
        <div style={{margin:'10px 0'}}>
          <input type="text" value={editUser.nombre} onChange={e=>setEditUser({...editUser,nombre:e.target.value})} placeholder="Nombre" />
          <input type="text" value={editUser.apellido} onChange={e=>setEditUser({...editUser,apellido:e.target.value})} placeholder="Apellido" />
          <input type="text" value={editUser.dni} onChange={e=>setEditUser({...editUser,dni:e.target.value})} placeholder="DNI" />
          <input type="text" value={editUser.telefono} onChange={e=>setEditUser({...editUser,telefono:e.target.value})} placeholder="Teléfono" />
          <input type="email" value={editUser.email} onChange={e=>setEditUser({...editUser,email:e.target.value})} placeholder="Email" />
          <input type="text" value={editUser.username} onChange={e=>setEditUser({...editUser,username:e.target.value})} placeholder="Usuario" />
          <input type="password" value={editUser.password} onChange={e=>setEditUser({...editUser,password:e.target.value})} placeholder="Contraseña" />
          <button onClick={handleSaveUser}>Guardar</button>
          <button onClick={()=>setEditMode(false)}>Cancelar</button>
        </div>
      )}
      <h3>Actividades donde eres participante</h3>
      <ul>
        {participantActivities.map(a => {
          const reserva = participantReservations.find(r => r.activityId === a.id);
          return (
            <li key={a.id}>
              {a.title} <br />
              {reserva ? (
                <span>
                  Código de pago: {reserva?.codigoPago || reserva?.confirmationCode} <br />
                  Estado: {reserva?.status} <br />
                  Fecha: {a.dates?.join(', ')}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
      <h3>Actividades donde eres anfitrión</h3>
      <ul>
        {hostActivities.map(a => (
          <li key={a.id}>{a.title}</li>
        ))}
      </ul>
      <h3>Agregar nueva actividad como anfitrión</h3>
      <form onSubmit={handleAddActivity}>
        <input type="text" placeholder="Título" value={newActivity.title} onChange={e => setNewActivity({ ...newActivity, title: e.target.value })} required />
        <input type="text" placeholder="Descripción" value={newActivity.description} onChange={e => setNewActivity({ ...newActivity, description: e.target.value })} required />
        <input type="number" placeholder="Precio" value={newActivity.price} onChange={e => setNewActivity({ ...newActivity, price: e.target.value })} required />
        <label>Fechas disponibles:</label>
        <input type="date" value={newActivity.dates[0] || ''} onChange={e => setNewActivity({ ...newActivity, dates: [e.target.value, newActivity.dates[1] || ''] })} required />
        <span> a </span>
        <input type="date" value={newActivity.dates[1] || ''} onChange={e => setNewActivity({ ...newActivity, dates: [newActivity.dates[0] || '', e.target.value] })} required />
        <label>Días de la semana:</label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          {["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"].map(dia => (
            <label key={dia}>
              <input
                type="checkbox"
                checked={newActivity.daysOfWeek.includes(dia)}
                onChange={e => {
                  if (e.target.checked) {
                    setNewActivity({ ...newActivity, daysOfWeek: [...newActivity.daysOfWeek, dia] });
                  } else {
                    setNewActivity({ ...newActivity, daysOfWeek: newActivity.daysOfWeek.filter(d => d !== dia) });
                  }
                }}
              />
              {dia}
            </label>
          ))}
        </div>
        <label>Horario:</label>
        <input type="time" value={newActivity.time.split('-')[0] || ''} onChange={e => handleTimeChange(e, 'start')} required step="60" />
        <span> a </span>
        <input type="time" value={newActivity.time.split('-')[1] || ''} onChange={e => handleTimeChange(e, 'end')} required step="60" />
        <input type="text" placeholder="Provincia" value={newActivity.location.provincia} onChange={e => setNewActivity({ ...newActivity, location: { ...newActivity.location, provincia: e.target.value } })} required />
        <input type="text" placeholder="Departamento" value={newActivity.location.departamento} onChange={e => setNewActivity({ ...newActivity, location: { ...newActivity.location, departamento: e.target.value } })} required />
        <input type="text" placeholder="Dirección" value={newActivity.location.direccion} onChange={e => setNewActivity({ ...newActivity, location: { ...newActivity.location, direccion: e.target.value } })} required />
        <input type="text" placeholder="URL de foto" value={newActivity.photos} onChange={e => setNewActivity({ ...newActivity, photos: e.target.value.split(',') })} />
        <button type="submit">Agregar actividad</button>
      </form>
    </div>
  );
};
