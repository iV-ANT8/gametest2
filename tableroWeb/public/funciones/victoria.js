import { globales } from "./globales.js";

// FUNCIONES DE LA PESTAÑA DE VICTORIA AL LLEGAR A LOS 500 PUNTOS

export function mostrarVictoria(){
  globales.popV.classList.remove("hidden");
};

export function cerrarVictoria(){
  globales.popV.classList.add("hidden");
  location.reload();
};
