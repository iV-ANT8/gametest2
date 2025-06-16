const jugador = require("../player/jugador");
const { tableroConsola, tableroWeb } = require("../tableros");

const keyActions = {
  left: () => {
    jugador.retroceder();
  },
  right: () => {
    jugador.avanzar();
  },
  up: () => {
    jugador.subir();
  },
  down: () => {
    jugador.bajar();
  },
  w: () => {
    jugador.agregarObservador(tableroWeb);
    console.log("Observador Web Agregado");
  },
  c: () => {
    jugador.agregarObservador(tableroConsola);
    console.log("Observador de consola Agregado");
  },
  e: () => {
    jugador.quitarObservador(tableroWeb);
    console.log("Observador Web quitado");
  },
  v: () => {
    jugador.quitarObservador(tableroConsola);
    console.log("Observador de consola quitado");
  },
  q: () => {
    console.log("Saliendo del programa....");
    process.exit();
  },
};

module.exports = keyActions;
