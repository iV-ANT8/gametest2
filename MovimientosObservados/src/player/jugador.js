const tableros = require("../tableros");

class Jugador {
  static FILAS = 10;
  static COLUMNAS = 10;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.movs = 0;
    this.observadores = [];
  }

  agregarObservador(unObservador) {
    this.observadores.push(unObservador);
    unObservador.actualizar({
      posX: this.x,
      posY: this.y,
      cantMovims: this.movs,
    });
  }
  quitarObservador(unObservador) {
    const idx = this.observadores.findIndex((o) => o == unObservador);
    if (idx >= 0) this.observadores.splice(idx, 1);
  }

  registrarMovimiento() {
    this.movs++;
    this.observadores.forEach((t) =>
      t.actualizar({ posX: this.x, posY: this.y, cantMovims: this.movs })
    );
  }
  avanzar() {
    if (this.x == Jugador.COLUMNAS - 1) this.x = 0;
    else this.x++;
    this.registrarMovimiento();
  }

  retroceder() {
    if (this.x == 0) this.x = Jugador.COLUMNAS - 1;
    else this.x--;
    this.registrarMovimiento();
  }

  subir() {
    if (this.y == Jugador.FILAS - 1) this.y = 0;
    else this.y++;
    this.registrarMovimiento();
  }

  bajar() {
    if (this.y == 0) this.y = Jugador.FILAS - 1;
    else this.y--;
    this.registrarMovimiento();
  }

  estado() {
    return { x: this.x, y: this.y, movs: this.movs };
  }
}

module.exports = new Jugador();
