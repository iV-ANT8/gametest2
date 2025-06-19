export const globales = {
    // fuego
    fx: 0,
    fy: 0,
    bolasdeFuego: [],
    // manzana random
    rx: 0,
    ry: 0,
    manzanaExiste: null,
    intervaloM: null,
    // jugador
    posX: 0,
    posY: 0,
    pasos: 0,
    score: 0,
    // document
    board: document.getElementById("board"),
    cells: document.querySelectorAll(".cell"),
    skl: document.createElement("img"),
    car: document.createElement("img"),
    popV: document.getElementById("victoria"),
    // socket del jugador para el reseteo correcto del score con el impacto de un fuego
    socket: null
};