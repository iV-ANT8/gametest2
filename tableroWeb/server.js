const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  ws.on("close", () => {
    clients = clients.filter((c) => c !== ws);
  });
});

app.use(express.static("public"));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Endpoint para recibir movimiento
app.post("/move", (req, res) => {
  const { x, y, pasos } = req.body;
  if (typeof x === "number" && typeof y === "number") {
    // Enviar movimiento a todos los clientes conectados
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ x, y, pasos }));
      }
    });
    res.json({ status: "ok" });
  } else {
    res.status(400).json({ error: "x e y deben ser números" });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
