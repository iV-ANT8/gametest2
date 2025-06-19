const score = require("../../../scoreTotal.js");
const { enviarAClientes } = require("../../../tableroWeb/server.js");

class TableroConsola {
  static FILAS = 10;
  static COLUMNAS = 10;

  constructor() {
    this.rxConsola = null;
    this.ryConsola = null;
    this.manzanaVisible = false;
    this.intervaloManzana = null;
    this.dissapearTime = null;
    this.score = score;
    this.enviarAClientes = enviarAClientes;
    this.startIntervaloManzana();
  }

    spawnManzana() {
    this.rxConsola = Math.floor(Math.random() * TableroConsola.COLUMNAS);
    this.ryConsola = Math.floor(Math.random() * TableroConsola.FILAS);
  }

  startIntervaloManzana() {
    this.intervaloManzana = setInterval(() => { // Aparición y eliminación de la manzana cada 5 segundos
      if (!this.manzanaVisible) {
        this.spawnManzana();
        this.manzanaVisible = true;
        this.manzanaAgarrada = false;
        this.dissapearTime = setTimeout(() => {
          this.rxConsola = null;
          this.ryConsola = null;
          this.manzanaVisible = false;
        }, 5000);
      }
    }, 5000);
  }

  dibujar(x, y, pasos) {
    console.clear(); // Borrar Tablero Anterior
    if (
      x < 0 ||
      x >= TableroConsola.COLUMNAS ||
      y < 0 ||
      y >= TableroConsola.FILAS
    ) {
      return;
    }

    // Parte superior
    let tablero = "╔";
    for (let i = 0; i < TableroConsola.COLUMNAS - 1; i++) {
      tablero += "═══╦";
    }
    tablero += "═══╗\n";

    // Cuerpo de la grilla
    for (let fila = TableroConsola.FILAS - 1; fila >= 0; fila--) {
      tablero += "║";
      for (let columna = 0; columna < TableroConsola.COLUMNAS; columna++) {
        // Cambio importante aquí: comparar columna con x y fila con y
        if (columna === x && fila === y) {
          tablero += pasos.toString().padStart(3, " ");
        } else if (this.manzanaVisible && columna === this.rxConsola && fila === this.ryConsola) { // insertar manzana
          tablero += " 🍎 ";
        } else {
          tablero += "   ";
        }
        tablero += "║";
      }
      tablero += "\n";

      if (fila > 0) {
        // Línea intermedia
        tablero += "╠";
        for (let i = 0; i < TableroConsola.COLUMNAS - 1; i++) {
          tablero += "═══╬";
        }
        tablero += "═══╣\n";
      }
    }

    // Parte inferior
    tablero += "╚";
    for (let i = 0; i < TableroConsola.COLUMNAS - 1; i++) {
      tablero += "═══╩";
    }
    tablero += "═══╝\n";

    console.log(tablero);
  }

  actualizar(estadoANotificar) {
    const { posX, posY } = estadoANotificar;
    // Si se recoge una manzana...
    if (this.manzanaVisible && !this.manzanaAgarrada && posX === this.rxConsola && posY === this.ryConsola) {
      this.manzanaAgarrada = true;
      this.manzanaVisible = false;
      clearTimeout(this.dissapearTime);
    // Se agregan los puntos.
      this.score.addScore(10);
      this.enviarAClientes({tipo:"score", puntos: score.getScore()});
      this.rxConsola = null;
      this.ryConsola = null;
    }
    this.dibujar(
      posX,
      posY,
      estadoANotificar.cantMovims
    );
  }
}
module.exports = new TableroConsola();
