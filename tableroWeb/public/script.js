const board = document.getElementById("board");

// import {listColores} from "./colores.js";

// Crear tablero 10x10 con (0,0) abajo a la izquierda
for (let y = 9; y >= 0; y--) {
  // ← de 9 a 0 para que 0 esté abajo
  for (let x = 0; x < 10; x++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.x = x;
    cell.dataset.y = y;
    board.appendChild(cell);
  }
}

function getCell(x, y) {
  return document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

let rx = 0;
let ry = 0;
let manzanaExiste = null;
let cells = document.querySelectorAll(".cell");
// Manzana
function bonusManzana(){
  // -------- Eliminar la manzana anterior para spawnear la siguiente ----
  if (manzanaExiste != null){
    const manz = manzanaExiste.querySelector(".apple")
    if (manz){
      manz.remove();
    }
  }
  // ------- Indice random --------
  rx = Math.floor(Math.random() * 10);
  ry = Math.floor(Math.random() * 10);
  const ri = (9 - ry) * 10 + rx; // porque y está invertido
  const randomCell = cells[ri];
  // ------- Insertar Imagen ---------
  const apl = document.createElement("img");
  apl.src = "Apple16b.png";
  apl.classList.add("apple");
  randomCell.appendChild(apl);
  manzanaExiste = randomCell;
}

// Posición inicial del autito
let car = document.createElement("img");
car.src = "jugador.png";
car.classList.add("car");
let posX = 0,
  posY = 0;
getCell(posX, posY).appendChild(car);

let pasos = 0;
let score = 0;
// WebSocket para recibir movimiento
const socket = new WebSocket(`ws://${location.host}`);

socket.onmessage = (event) => {
  const { x, y, pasos: pasoDado } = JSON.parse(event.data); //deseestructuración
  if (typeof pasoDado === "number") { // si es un num, actualizo el global pasos
    pasos = pasoDado;
  }
  // Movimiento
  if (x >= 0 && y >= 0 && x < 10 && y < 10) {
      const oldCell = getCell(posX, posY);
      if (oldCell && oldCell.contains(car)) {
        oldCell.removeChild(car);
      }
      const newCell = getCell(x, y);
      if (newCell.querySelector(".fire")) {
        score = 0;
        updateScore();

        let newX, newY, newCellPers;
        do {
          newX = Math.floor(Math.random() * 10);
          newY = Math.floor(Math.random() * 10);
          newCellPers = getCell(newX, newY);
        } while (newCellPers.querySelector(".fire"));

        enviarPosicionAlServidor(newX, newY, 0);
      } 
      newCell.appendChild(car);
      posX = x;
      posY = y;
      console.log(`Jugador en: (${x}, ${y}), posX/posY actual: (${posX}, ${posY})`);
    }
    // Bonus de la manzana
    if (x === rx && y === ry) {
      score += 10;
      manzanaAgarrada();
    }
    if (pasos !== undefined){
      document.getElementById("pasos-counter").textContent = `Movimientos: ${pasos}`;
    }
  updateScore();
  // alert(`Jugador: (${x},${y}), Manzana: (${rx},${ry}), Score: ${score}`);
}

function enviarPosicionAlServidor(x, y, pasos = 0) {
  fetch("/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ x, y, pasos }),
  });
}
// Fireball
let fx= 0;
let fy= 0;

function bolaFuego(){
  // Aparicion en el tablero (de la derecha)
  let fx = 9;
  let fy = Math.floor(Math.random() * 10);
  const ind = (9 - fy) * 10 + fx;
  const celdaInicial = cells[ind];

  // Insertar imagen
  const bdF = document.createElement("img");
  bdF.src = "Fireball.png";
  bdF.classList.add("fire");
  celdaInicial.appendChild(bdF);

  // Movimiento
  const intervMovFuego = setInterval(() => {
    if (celdaInicial.contains(bdF)) {
      celdaInicial.removeChild(bdF);
    }
    fx--;
    if (fx < 0) {
      clearInterval(intervMovFuego);
      return
    }
    const siguienteInd = (9 - fy) * 10 + fx;
    const siguienteCelda = cells[siguienteInd];
    siguienteCelda.appendChild(bdF);

    // Colisión y eliminación del personaje
    if (fx === posX && fy === posY){
      const celdaPers = getCell(posX, posY);
      if (celdaPers.contains(car)) {
        celdaPers.removeChild(car);
        score = 0;
        updateScore();
      }
    
      let newXF, newYF, newCellFuego;
      do {
        newXF = Math.floor(Math.random() * 10);
        newYF = Math.floor(Math.random() * 10);
        newCellFuego = getCell(newXF, newYF)
      } while (newCellFuego.querySelector(".fire"));
      if (newCellFuego){
        newCellFuego.appendChild(car);
        posX = newXF
        posY= newYF
      }
      enviarPosicionAlServidor(newXF,newYF, pasos)
    };
    // si llega a la primera columna, se elimina después del intervalo
    if (fx === 0) {
      setTimeout(() => {
        if (siguienteCelda.contains(bdF)) {
          siguienteCelda.removeChild(bdF);
        }
      }, 1000);
      clearInterval(intervMovFuego);
    }
  }, 1000);
}

setInterval(bolaFuego, 1500);

// --------- Colores ---------
const listColores = [
    {min: 0, color: "black"},
    {min: 100, color: "blue"},
    {min: 200, color: "purple"},
    {min: 300, color: "cyan"},
    {min: 400, color: "aquamarine"},
    {min: 500, color: "silver"},
    {min: 600, color: "orangered"},
    {min: 700, color: "orange"},
    {min: 800, color: "red"},
    {min: 900, color: "darkred"},
    {min: 1000, color: "gold"},
]
// Funcion para actualizar el Score Total
function updateScore() {
  const scorePoints = document.getElementById("score-counter");
  scorePoints.textContent = `Score: ${score}`;
  // ----- Cambio de color ----
  for (let i = listColores.length - 1; i >= 0; i--) {
    if (score >= listColores[i].min) { // de mi lista busco el minimo que sea menor o igual a los puntos totales
      scorePoints.style.color = listColores[i].color;
      break;
    }
  }
};
// Aparición + Intervalo
bonusManzana();
empezarIntervalo();
function empezarIntervalo(){
  intervaloM = setInterval(() => { bonusManzana() }, 5000);
};

function manzanaAgarrada(){
  clearInterval(intervaloM);
  bonusManzana();
  empezarIntervalo();
};
