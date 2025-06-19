const consola = require("./MovimientosObservados/src/index.js");
const {server} = require("./tableroWeb/server.js");

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
}); 
