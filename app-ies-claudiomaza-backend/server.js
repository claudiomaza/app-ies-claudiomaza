
const jsonServer = require('json-server');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Habilitar CORS para todas las peticiones
server.use(cors());

// Usa los middlewares predeterminados de json-server
server.use(middlewares);

// Middleware para procesar el cuerpo de las peticiones en formato JSON
server.use(jsonServer.bodyParser);

// Middleware para autenticación básica
const isAuthenticated = (req, res, next) => {
  const user = req.headers.authorization ? JSON.parse(atob(req.headers.authorization.split(' ')[1])) : null;
  if (!user) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  req.user = user;
  next();
};

// Endpoint GET /users/reservations/:userId para obtener las reservas de un usuario
server.get('/users/reservations/:userId', isAuthenticated, (req, res) => {
    const dbPath = path.join(__dirname, 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath));
    const userId = parseInt(req.params.userId);

    // Verificar que el usuario autenticado solo acceda a sus propias reservas
    if (req.user.id !== userId) {
        return res.status(403).json({ error: 'No autorizado para acceder a estas reservas' });
    }

    const userReservations = dbData.reservations.filter(r => r.userId === userId);
    if (!userReservations) {
        return res.status(404).json({ error: 'No se encontraron reservas para este usuario' });
    }

    res.json(userReservations);
});

// Endpoint GET /activities/search para búsqueda avanzada
server.get('/activities/search', (req, res) => {
    const dbPath = path.join(__dirname, 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath));
    let results = dbData.activities;

    // Filtros flexibles por query params
    if (req.query.title) {
        results = results.filter(a => a.title.toLowerCase().includes(req.query.title.toLowerCase()));
    }
    if (req.query.authorId) {
        results = results.filter(a => a.authorId === parseInt(req.query.authorId));
    }
    if (req.query.authorUsername) {
        results = results.filter(a => a.authorUsername.toLowerCase() === req.query.authorUsername.toLowerCase());
    }
    if (req.query.provincia) {
        results = results.filter(a => a.location && a.location.provincia.toLowerCase() === req.query.provincia.toLowerCase());
    }
    if (req.query.departamento) {
        results = results.filter(a => a.location && a.location.departamento.toLowerCase() === req.query.departamento.toLowerCase());
    }
    if (req.query.direccion) {
        results = results.filter(a => a.location && a.location.direccion.toLowerCase().includes(req.query.direccion.toLowerCase()));
    }
    if (req.query.minPrice) {
        results = results.filter(a => a.price >= parseInt(req.query.minPrice));
    }
    if (req.query.maxPrice) {
        results = results.filter(a => a.price <= parseInt(req.query.maxPrice));
    }
    if (req.query.dayOfWeek) {
        results = results.filter(a => a.daysOfWeek && a.daysOfWeek.includes(req.query.dayOfWeek));
    }
    if (req.query.date) {
        results = results.filter(a => a.dates && a.dates.includes(req.query.date));
    }
    if (req.query.time) {
        results = results.filter(a => a.time && a.time.includes(req.query.time));
    }
    // Se pueden agregar más filtros fácilmente

    res.json(results);
});

// Maneja la petición POST a /reservations
server.post('/reservations', (req, res) => {
    // Lee el contenido actual de la base de datos
    const dbPath = path.join(__dirname, 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath));

    // Genera un cÃ³digo de confirmaciÃ³n Ãºnico
    const confirmationCode = 'CONF-' + Math.floor(Math.random() * 90000) + 10000;
    const newReservation = {
        ...req.body,
        id: Date.now(),
        confirmationCode: confirmationCode,
        status: 'pending'
    };

    // AÃ±ade la nueva reserva a la lista de reservas
    dbData.reservations.push(newReservation);

    // Escribe el contenido actualizado de vuelta al archivo db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    // Responde al cliente con el objeto de la nueva reserva
    res.status(201).json(newReservation);
});

// Usa el enrutador de json-server para las peticiones GET (para ver los datos)
server.use(router);

// Endpoint GET /users/reservations/:userId para obtener las reservas de un usuario
server.get('/users/reservations/:userId', (req, res) => {
    const dbPath = path.join(__dirname, 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath));
    
    const userId = parseInt(req.params.userId);
    const userReservations = dbData.reservations.filter(r => r.userId === userId);
    
    // Obtener los detalles de las actividades reservadas
    const reservationsWithDetails = userReservations.map(reservation => {
        const activity = dbData.activities.find(a => a.id === reservation.activityId);
        return {
            ...reservation,
            activity: activity || null
        };
    });

    res.json(reservationsWithDetails);
});

// Endpoint PATCH /reservations/:id para actualizar el estado de una reserva
server.patch('/reservations/:id', (req, res) => {
    const dbPath = path.join(__dirname, 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath));
    
    const reservationId = parseInt(req.params.id);
    const reservationIndex = dbData.reservations.findIndex(r => r.id === reservationId);
    
    if (reservationIndex === -1) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Actualizar el estado y la fecha de actualización
    const updatedReservation = {
        ...dbData.reservations[reservationIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    dbData.reservations[reservationIndex] = updatedReservation;

    // Guardar cambios en la base de datos
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    res.json(updatedReservation);
});

// Endpoint POST /reservations para crear una nueva reserva
server.post('/reservations', (req, res) => {
    const dbPath = path.join(__dirname, 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath));

    const newReservation = {
        ...req.body,
        id: Date.now(),
        status: 'pending',
        confirmationCode: 'CONF-' + Math.floor(Math.random() * 9000000 + 1000000),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Validar que la actividad exista
    const activity = dbData.activities.find(a => a.id === newReservation.activityId);
    if (!activity) {
        return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    // Agregar la reserva a la base de datos
    dbData.reservations.push(newReservation);
    
    // Agregar el ID de la reserva a la lista de reservas de la actividad
    const activityIndex = dbData.activities.findIndex(a => a.id === newReservation.activityId);
    if (activityIndex !== -1) {
        if (!dbData.activities[activityIndex].reservations) {
            dbData.activities[activityIndex].reservations = [];
        }
        dbData.activities[activityIndex].reservations.push(newReservation.id);
    }

    // Guardar cambios en la base de datos
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    res.status(201).json(newReservation);
});

// Endpoint GET /users para listar usuarios
server.get('/users', (req, res) => {
    const dbPath = path.join(__dirname, 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath));
    res.json(dbData.users || []);
});

// Endpoint POST /users para registrar nuevos usuarios
server.post('/users', (req, res) => {
    const dbPath = path.join(__dirname, 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath));
    const newUser = {
        ...req.body,
        id: Date.now(),
        activities: [],
        reservations: []
    };
    dbData.users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    res.status(201).json(newUser);
});
// Endpoint POST /activities para crear una nueva actividad
server.post('/activities', (req, res) => {
    const dbPath = path.join(__dirname, 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath));
    // Obtener el id del usuario autenticado desde el header
    const userId = parseInt(req.header('x-user-id'));
    const user = dbData.users.find(u => u.id === userId);
    if (!user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    const newActivity = {
        ...req.body,
        id: Date.now(),
        authorId: user.id,
        authorUsername: user.username,
        reservations: []
    };
    dbData.activities.push(newActivity);
    user.activities.push(newActivity.id);
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    res.status(201).json(newActivity);
});

// Endpoint PUT /activities/:id para editar una actividad existente
server.put('/activities/:id', (req, res) => {
    const dbPath = path.join(__dirname, 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath));
    const activityId = parseInt(req.params.id);
    const activityIndex = dbData.activities.findIndex(a => a.id === activityId);
    if (activityIndex === -1) {
        return res.status(404).json({ error: 'Actividad no encontrada' });
    }
    // Validar que el usuario autenticado sea el autor
    const userId = parseInt(req.header('x-user-id'));
    if (dbData.activities[activityIndex].authorId !== userId) {
        return res.status(403).json({ error: 'No tienes permisos para editar esta actividad' });
    }
    // Actualizar los campos de la actividad
    dbData.activities[activityIndex] = {
        ...dbData.activities[activityIndex],
        ...req.body,
        id: activityId // Mantener el id original
    };
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    res.json(dbData.activities[activityIndex]);
});

// Inicia el servidor
server.listen(3001, () => {
    console.log('JSON Server is running on port 3001');
});
