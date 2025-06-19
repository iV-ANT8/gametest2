import { globales } from "./globales.js";

export function crearTablero() {
    // Crear tablero 10x10 con (0,0) abajo a la izquierda
    for (let y = 9; y >= 0; y--) {
    // ← de 9 a 0 para que 0 esté abajo
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.x = x;
            cell.dataset.y = y;
            globales.board.appendChild(cell);
        }
    }
    globales.cells = document.querySelectorAll(".cell")
}

export function getCell(x, y) {
  return document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
};

// Columna Roja
export function columnaPeligro(){
    for (let x = 0; x < 10; x++) {
    const IndCeldaColor = (9-x) * 10 + 9;
    const celdaColor = globales.cells[IndCeldaColor];
    celdaColor.classList.add("danger");
    }
};