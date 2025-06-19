import { globales } from "./globales.js";

globales.skl.src = "img/Ghoul.png";
globales.skl.classList.add("ghoul");
// Timeout de Ghoul
export function ghoulDissapear(celdaMuerto) {
  const cM = celdaMuerto;
  setTimeout(() => {
    if (cM.contains(globales.skl)){
      cM.removeChild(globales.skl);
    }
  }, 500);
}