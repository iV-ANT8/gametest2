import { globales } from "./globales.js";

export function mostrarVictoria(){
  globales.popV.classList.remove("hidden");
};

export function cerrarVictoria(){
  globales.popV.classList.add("hidden");
  location.reload();
};