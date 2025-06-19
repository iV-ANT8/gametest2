const keypress = require("keypress");
const keyActions = require("./teclado/teclas");

keypress(process.stdin);

process.stdin.on("keypress", (_, key) => {
  if (key && keyActions[key.name]) {
    keyActions[key.name]();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

console.log("Usa la FLECHAS para moverte y la Q para salir");
console.log("Usa la W para agregar un Observador Web y la E para quitarlo")
console.log("Usa la C para agregar un Observador Consola y la V para quitarlo")
