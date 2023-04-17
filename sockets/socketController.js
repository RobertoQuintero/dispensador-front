const { Socket } = require("socket.io");

const socketController = async (socket = new Socket(), io) => {
  console.log("cliente conectado");
  //conectarlo a una sala especial
  // socket.join(usuario.id);

  socket.on("connect", () => {
    console.log("conectado");
  });
  socket.on("disconnect", () => {
    console.log("desconectado");
  });

  socket.on("mover-motor", (msg) => {
    console.log("mueve motor: " + msg);
    socket.emit("movio-motor", "termina movimiento motor");
  });
};

module.exports = {
  socketController,
};
