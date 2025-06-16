class TableroConsola {
  static FILAS = 10;
  static COLUMNAS = 10;

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
    this.dibujar(
      estadoANotificar.posX,
      estadoANotificar.posY,
      estadoANotificar.cantMovims
    );
  }
}

module.exports = new TableroConsola();
