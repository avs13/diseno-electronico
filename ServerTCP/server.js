const net = require('net');
const { rawToLocation } = require("./rawToLocation");   
const mongoose = require("mongoose");
require("dotenv").config();

const server = net.createServer();


mongoose
    .connect(process.env.MONGOODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'));
    
server.on('connection', (socket) => {
    socket.on('data', (data) => {
        console.log('\nEl cliente ' + socket.remoteAddress + ":" + socket.remotePort + " dice... Tus coordenadas son: ");
        
        const hexData = rawToHexa(data.toString()); 
        const location = rawToLocation(hexData);     
        console.log(JSON.stringify(location));
        
        socket.write('Recibido!');
    });

    socket.on('close', () => {
        console.log('Comunicación finalizada');
    });

    socket.on('error', (err) => {
        console.log(err.message);
    });
});

function rawToHexa(message){
    const bytes = Buffer.from(message, 'utf-8');
    const hexValues = [];
    for (const byte of bytes) {
        hexValues.push(byte.toString(16).padStart(2, '0'));
    }
    return hexValues.join(' ')
}

server.listen(8000, () => {
    console.log('Servidor está escuchando en la puerta', server.address().port);
});


