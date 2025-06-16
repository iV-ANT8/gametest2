const axios = require("axios");

class TableroWeb {
  constructor(baseURL) {
    this.sender = new Sender(baseURL);
  }
  actualizar(estadoANotificar) {
    this.sender.notificarEstado(
      estadoANotificar.posX,
      estadoANotificar.posY,
      estadoANotificar.cantMovims
    );
  }
}

class Sender {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 5000,
    });
  }

  async notificarEstado(posX, posY, movs) {
    try {
      const response = await this.client.post("/move", {
        x: posX,
        y: posY,
        pasos: movs,
      });
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = new TableroWeb("http://localhost:3000");
