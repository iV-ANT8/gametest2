import { globales } from "./globales.js";
import { getCell } from "./tablero.js";
import { updateScore } from "./score.js";
import { ghoulDissapear } from "./ghoul.js"
import { manzanaAgarrada } from "./manzana.js";

export function startJugador(){
    globales.car.src = "img/jugador.png";
    globales.car.classList.add("car");
    getCell(globales.posX, globales.posY).appendChild(globales.car);

    // WebSocket para recibir movimiento
    const socket = new WebSocket(`ws://${location.host}`);
    globales.socket = socket;

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (typeof data.x === "number" && typeof data.y === "number") {
            const { x, y, pasos: pasoDado } = data; //deseestructuración
            if (typeof pasoDado === "number") { // si es un num, actualizo el global pasos
                globales.pasos = pasoDado;
            }
            // Movimiento
            if (x >= 0 && y >= 0 && x < 10 && y < 10) {
                const oldCell = getCell(globales.posX, globales.posY);
                if (oldCell && oldCell.contains(globales.car)) {
                    oldCell.removeChild(globales.car);
                }
                // Colisión con fuego
                const newCell = getCell(x, y);
                const peligroFuego = newCell.querySelector(".fire");
                if (peligroFuego) {
                    newCell.contains(globales.car) && newCell.removeChild(globales.car)
                    newCell.contains(peligroFuego) && newCell.removeChild(peligroFuego)

                    const fue = globales.bolasdeFuego.find((f) => f.elemento === peligroFuego); // Busco el elemento en mi lista
                    if (fue) clearInterval(fue.intervMovFuego) // Borro el intervalo de dicho elemento.
                    newCell.appendChild(globales.skl);
                    ghoulDissapear(newCell);
                    socket.send(JSON.stringify({ tipo: "gameOver" }));
                    return; // ELIMINAR PARA JUGADOR INVULNERABLE
                }
                newCell.appendChild(globales.car);
                globales.posX = x;
                globales.posY = y;
            }
            // Bonus de la manzana
            if (x === globales.rx && y === globales.ry) {
            manzanaAgarrada();
            socket.send(JSON.stringify({ tipo: "addScore", puntos: 10 })); // lo mando al server
            } 
        }
        if (data.tipo === "score" && typeof data.puntos === "number") {
        globales.score = data.puntos;
        updateScore();
        }

        if (data.tipo === "gameOver") {
        // Ya reseteado en servidor, solo actualizamos UI
        globales.score = 0;
        updateScore();
        }
        // Contador de pasos
        if (globales.pasos !== undefined){
        document.getElementById("pasos-counter").textContent = `Movimientos: ${globales.pasos}`;
        }
    }
}