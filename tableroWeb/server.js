const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const score = require("../scoreTotal.js");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      // Según el tipo de dato reunido, se actualiza el score para cada cliente
      // FUNCION UBICADA AL FINAL DEL ARCHIVO
      if (data.tipo === "addScore" && typeof data.puntos === "number") {
        score.addScore(data.puntos);
        enviarAClientes({ tipo: "score", puntos: score.getScore() });
      } else if (data.tipo === "gameOver") {
        score.resetScore();
        enviarAClientes({ tipo: "score", puntos: score.getScore() });
        enviarAClientes({ tipo: "gameOver" });
      }
    } catch (error) {
      console.error("Error con el mensaje:", error);
    }
  });
  ws.on("close", () => {
    clients = clients.filter((c) => c !== ws);
  });
});

app.use(express.static(path.join(__dirname,"public"))); // se accede al public dentro de la carpeta para cargar la web
app.use(express.json());

app.use((req, res, next) => {
  // console.log(`${req.method} ${req.url}`);
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

// Envía los datos a los clientes (tipo y score)
function enviarAClientes(data) {
  const str = JSON.stringify(data);
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(str);
    }
  });
}

// Servidor iniciado solo si se ejecuta directamente (por priv) y no como módulo
if (require.main === module) {
  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = { app, server, wss, enviarAClientes };
