const { WebSocketServer } = require("ws");
const express = require("express");
const net = require("net");
const cors = require("cors");
const serviceLocation = require("./api/location/service");
const { rawToLocation } = require("./utils/rawToLocation");
const { rawToHexa } = require("./utils/rawToHexa");
const config = require("./config/");
const api = require("./api/routes");

const app = express();

const httpServer = require("http").createServer(app);
const wss = new WebSocketServer({ server: httpServer });
const server = net.createServer();

app.use(cors());
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
app.use("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(config.serversPorts.tcp, () => {
  console.log("Server TCP listening on port", config.serversPorts.tcp);
});

httpServer.listen(config.serversPorts.http, () => {
  console.log("Server HTTP listening on port", config.serversPorts.http);
});
