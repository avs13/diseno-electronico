const net = require('net');
const { rawToLocation } = require("./utils/rawToLocation");   
const { rawToHexa } = require("./utils/rawToHexa");   
const mongoose = require("mongoose");
require("dotenv").config();
const Location = require('./Location');  

const server = net.createServer();

mongoose
    .connect(process.env.MONGOODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(error => console.error('Error connecting to MongoDB:', error));
    
server.on('connection', (socket) => {
    socket.on('data', async (data) => {
        console.log('\nEl cliente ' + socket.remoteAddress + ":" + socket.remotePort + " dice... Tus coordenadas son: ");
        
        const hexData = rawToHexa(data.toString()); 
        const locationData = rawToLocation(hexData);     
        console.log(JSON.stringify(locationData));
        
        try {
            const newLocation = new Location({ coordinates: JSON.stringify(locationData) });
            await newLocation.save();
            console.log('Ubicación almacenada en la base de datos:', newLocation);
            socket.write('Recibido y almacenado en la base de datos!');
        } catch (error) {
            console.error('Error al guardar la ubicación:', error);
            socket.write('Error al almacenar en la base de datos.');
        }
    });

    socket.on('close', () => {
        console.log('Comunicación finalizada');
    });

    socket.on('error', (err) => {
        console.log(err.message);
    });
});

server.listen(8000, () => {
    console.log('Servidor está escuchando en la puerto', server.address().port);
});
