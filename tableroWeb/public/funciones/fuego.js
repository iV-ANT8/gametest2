import { globales } from "./globales.js";
import { getCell } from "./tablero.js";
import { ghoulDissapear } from "./ghoul.js";
import { updateScore } from "./score.js";

export function bolaFuego(){
  // Aparicion en el tablero (desde la derecha)
  // No uso globales para que cada fuego cumpla con su propio intervalo
  let fx = 9;
  let fy = Math.floor(Math.random() * 10);
  const ind = (9 - fy) * 10 + fx;
  const celdaInicial = globales.cells[ind];

  // Insertar imagen
  const bdF = document.createElement("img");
  bdF.src = "img/Fireball.png";
  bdF.classList.add("fire");
  celdaInicial.appendChild(bdF);

  // Elimino (si hay) manzana en la celda Inicial
  const manzEnInicio = celdaInicial.querySelector(".apple");
  if (manzEnInicio) {
    celdaInicial.removeChild(manzEnInicio);
  }
  // Guardo la información de cada bdF en la lista.
  const infoCadaBola = {elemento: bdF, intervMovFuego: null, fx, fy};
  globales.bolasdeFuego.push(infoCadaBola);

  // Movimiento
  infoCadaBola.intervMovFuego = setInterval(() => { //guardo el intervalo de movimiento de cada bdF
    const celdaActual = getCell(infoCadaBola.fx, infoCadaBola.fy);
    if (celdaActual && celdaActual.contains(bdF)) {  // IMPORTANTE PARA LA COLUMNA 0!
      celdaActual.removeChild(bdF); // antes que nada, elimino (si hay) la bola de fuego en la celda
    }
    infoCadaBola.fx--; // empiezo de derecha a izquierda
    if (infoCadaBola.fx < 0) {
      clearInterval(infoCadaBola.intervMovFuego); //para que no salga del tablero
      const iListaElim = globales.bolasdeFuego.indexOf(infoCadaBola); //Elimino de la lista global para evitar redundancia
      if (iListaElim !== -1)
        globales.bolasdeFuego.splice(iListaElim, 1);
      return
    }
    const siguienteInd = (9 - infoCadaBola.fy) * 10 + infoCadaBola.fx;
    const siguienteCelda = globales.cells[siguienteInd];
    if (siguienteCelda)
      siguienteCelda.appendChild(bdF);

    // Colisión y eliminación del personaje
    if (infoCadaBola.fx === globales.posX && infoCadaBola.fy === globales.posY){
      const celdaPers = getCell(globales.posX, globales.posY);
      if (celdaPers.contains(globales.car)) {
        celdaPers.removeChild(globales.car);
        siguienteCelda.removeChild(bdF);
        celdaPers.appendChild(globales.skl);
        ghoulDissapear(celdaPers);
        if (globales.socket && globales.socket.readyState === WebSocket.OPEN){
          globales.socket.send(JSON.stringify({ tipo: "gameOver" }));
        }
        clearInterval(infoCadaBola.intervMovFuego);
      }
    };

    // Colisión y eliminación de la manzana
    if (infoCadaBola.fx === globales.rx && infoCadaBola.fy === globales.ry){
      const celdaManz = getCell(globales.rx, globales.ry);
      const manzana = celdaManz.querySelector(".apple");
      if (manzana){
        celdaManz.contains(manzana) && celdaManz.removeChild(manzana);
        return;
      }
    }

    // si llega a la primera columna, se elimina después del intervalo
    if (infoCadaBola.fx === 0) {
      const bolaActual = infoCadaBola.elemento
      setTimeout(() => {
        if (bolaActual.parentElement) {
          bolaActual.parentElement.removeChild(bolaActual);
        }
      }, 1000);
      clearInterval(infoCadaBola.intervMovFuego);
      return;
    }
  }, 1000);
}