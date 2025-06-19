import { globales } from "./funciones/globales.js";
import { crearTablero, columnaPeligro } from "./funciones/tablero.js";
import { startJugador } from "./funciones/jugador.js";
import { bonusManzana, empezarIntervalo } from "./funciones/manzana.js";
import { bolaFuego } from "./funciones/fuego.js";
import { cerrarVictoria } from "./funciones/victoria.js";
import { updateScore } from "./funciones/score.js";

const socket = new WebSocket(`ws://${location.host}`);

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  if (data.tipo === "score" && typeof data.puntos === "number") {
    console.log(data)
    globales.score = data.puntos;
    updateScore(); // Esta función es la que actualiza el DOM
  }
});

// Tablero
crearTablero(globales.board);
columnaPeligro();
// Jugador
startJugador();
// Fuego + Intervalo
setInterval(bolaFuego, 1500);
// Manzana Aparición + Intervalo
bonusManzana();
empezarIntervalo();
// Ventana de victoria
window.cerrarVictoria = cerrarVictoria;
