const mongoose = require("mongoose");
const express = require("express");
const net = require('net');

const { rawToLocation } = require("./utils/rawToLocation");   
const { rawToHexa } = require("./utils/rawToHexa");  
const Location = require('./Location'); 
require("dotenv").config();
const app = express();
 
const { Server } = require("socket.io");
const httpServer = require("http").createServer(app);
const io = new Server(httpServer, { });
const server = net.createServer();

mongoose.connect(process.env.MONGOODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

io.on("connection", async (socket) => {
    Location.findOne({}, (err, doc) => {
        if (err) return;
        socket.emit("ws", doc);
    })
    
});

server.on('connection', (socket) => {
    socket.on('data', async (data) => {
        const hexData = rawToHexa(data); 
        const locationData = rawToLocation(hexData);     
        console.log("Nuevas coordenadas",locationData);
        
        try {
            const newLocation = new Location(locationData);
            io.emit("ws", JSON.stringify(locationData));
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
    console.log("Server TCP listening on port", server.address().port);
});


httpServer.listen(8001, () => {
    console.log("Server HTTP listening on port", 8001);
});
  
  