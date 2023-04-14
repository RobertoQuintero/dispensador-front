const { Socket } = require("socket.io");

const socketController = async (socket = new Socket(), io) => {
  //conectarlo a una sala especial
  socket.join(usuario.id);

  socket.on("connect", () => {
    console.log("conectado");
  });
  socket.on("disconnect", () => {
    console.log("desconectado");
  });
};

module.exports = {
  socketController,
};
