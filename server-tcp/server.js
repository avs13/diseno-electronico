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

app.get("/", (req, res) => {
    res.send(`<!DOCTYPE html>
    <html lang="en">
        <head>
            <title>Warp Chat</title>
        </head>
        <body>
            <h1>Warp chat</h1>
            <div id="chat">
                <p><em>Connecting...</em></p>
            </div>
            <input type="text" id="text" />
            <button type="button" id="send">Send</button>
            <script type="text/javascript">
            const chat = document.getElementById('chat');
            const text = document.getElementById('text');
            const uri = 'ws://' + location.host + '';
            const ws = new WebSocket(uri);
    
            function message(data) {
                const line = document.createElement('p');
                line.innerText = data;
                chat.appendChild(line);
            }
    
            ws.onopen = function() {
                chat.innerHTML = '<p><em>Connected!</em></p>';
            };
    
            ws.onmessage = function(msg) {
                console.log(msg.data);
                message(msg.data);
            };
    
            ws.onclose = function() {
                chat.getElementsByTagName('em')[0].innerText = 'Disconnected!';
            };
    
            send.onclick = function() {
                const msg = text.value;
                ws.send(msg);
                text.value = '';
    
                message('<You>: ' + msg);
            };
            </script>
        </body>
    </html>`)
});


httpServer.listen(8001, () => {
    console.log("Server HTTP listening on port", 8001);
});
  
  