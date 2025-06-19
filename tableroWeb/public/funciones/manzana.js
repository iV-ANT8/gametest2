import { globales } from "./globales.js";

export function bonusManzana(){
  // -------- Eliminar la manzana anterior para spawnear la siguiente ----
  if (globales.manzanaExiste != null){
    const manz = globales.manzanaExiste.querySelector(".apple")
    if (manz){
      manz.remove();
    }
  }
  // ------- Celda random sin fuego--------
  let randomCell;
  let ri;
  do {
  globales.rx = Math.floor(Math.random() * 10);
  globales.ry = Math.floor(Math.random() * 10);
  ri = (9 - globales.ry) * 10 + globales.rx; // porque y está invertido
  randomCell = globales.cells[ri];
  } while (randomCell.querySelector(".fire"));
  // ------- Insertar Imagen ---------
  const apl = document.createElement("img");
  apl.src = "img/Apple16b.png";
  apl.classList.add("apple");
  randomCell.appendChild(apl);
  globales.manzanaExiste = randomCell;
}

export function empezarIntervalo(){
  globales.intervaloM = setInterval(() => { bonusManzana() }, 5000);
};

export function manzanaAgarrada(){
  clearInterval(globales.intervaloM);
  bonusManzana();
  empezarIntervalo();
};