const { Socket } = require("socket.io");
const { Board, Stepper } = require("johnny-five");
var board,
  stepper,
  rpm = 10,
  acel = 1600,
  decel = 1600,
  steps = 2048,
  rev = 1;

board = new Board();

board.on("ready", () => {
  // init a led on pin 13, blink every 1000ms

  stepper = new Stepper({
    type: Stepper.TYPE.FOUR_WIRE,
    stepsPerRev: steps,
    pins: {
      motor1: 8,
      motor2: 10,
      motor3: 9,
      motor4: 11,
    },
  });
});

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
    // socket.emit("movio-motor", "termina movimiento motor");
    if (board.isReady) {
      stepper
        .rpm(rpm)
        .direction(Stepper.DIRECTION.CCW)
        .accel(acel)
        .decel(decel);

      stepper.step(steps * rev, () => {
        console.log("Done moving CCW");
      });
    }
  });
};

module.exports = {
  socketController,
};
