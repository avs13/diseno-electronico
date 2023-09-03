const { WebSocketServer } = require("ws");
const express = require("express");
const net = require("net");

const serviceLocation = require("./api/location/service");
const { rawToLocation } = require("./utils/rawToLocation");
const { rawToHexa } = require("./utils/rawToHexa");
const api = require("./api/routes");

const app = express();
const httpServer = require("http").createServer(app);
const wss = new WebSocketServer({ server: httpServer });
const server = net.createServer();

require("dotenv").config();

wss.on("connection", async (ws) => {
  try {
    const location = await serviceLocation.getLast();
    ws.send(JSON.stringify(location));
  } catch (error) {
    console.log(error);
  }
});

server.on("connection", (socket) => {
  socket.on("data", async (data) => {
    const hexData = rawToHexa(data);
    const locationData = rawToLocation(hexData);
    serviceLocation.add(locationData).catch(console.error);
    try {
      wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();
        ws.send(JSON.stringify(locationData));
      });
      socket.write("Recibido y almacenado en la base de datos!");
    } catch (error) {
      socket.write("Error al almacenar en la base de datos.");
    }
  });

  socket.on("close", () => {
    console.log("Comunicación finalizada");
  });

  socket.on("error", (err) => {
    console.log(err.message);
  });
});

app.use("/", express.static("public"));
app.use(express.json());
app.use("/api", api);

server.listen(8002, () => {
  console.log("Server TCP listening on port", server.address().port);
});

httpServer.listen(8001, () => {
  console.log("Server HTTP listening on port", 8001);
});
