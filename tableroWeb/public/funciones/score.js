import { globales } from "./globales.js";
import { mostrarVictoria } from "./victoria.js";
import { listColores } from "../datosExtra/coloreScore.js";

// Funcion para actualizar el Score Total
export function updateScore() {
  const scorePoints = document.getElementById("score-counter");
  scorePoints.textContent = `Score: ${globales.score}`;
  // ----- Cambio de color ----
  for (let i = listColores.length - 1; i >= 0; i--) {
    if (globales.score >= listColores[i].min) { // de mi lista busco el minimo que sea menor o igual a los puntos totales
      scorePoints.style.color = listColores[i].color;
      break;
    }
  }
  if (globales.score === 500) {
    mostrarVictoria();
  }
};