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

// Inicia el servidor
server.listen(3001, () => {
    console.log('JSON Server is running on port 3001');
});
