const { Socket } = require("socket.io");
const { Pin, Board, Stepper } = require("johnny-five");
var board,
  stepper1,
  stepper2,
  stepper3,
  rpm = 11,
  accel = 1600,
  decel = 1600,
  steps = 2048,
  rev = 1;

var pin2, pin3, pin4, pin5, pin6, pin7, pin8, pin9, pin10, pin11, pin12, pin13;

board = new Board();

board.on("ready", () => {
  // init a led on pin 13, blink every 1000ms

  pin2 = new Pin(2);
  pin3 = new Pin(3);
  pin4 = new Pin(4);
  pin5 = new Pin(5);
  pin6 = new Pin(6);
  pin7 = new Pin(7);
  pin8 = new Pin(8);
  pin9 = new Pin(9);
  pin10 = new Pin(10);
  pin11 = new Pin(11);
  pin12 = new Pin(12);
  pin13 = new Pin(13);

  stepper1 = new Stepper({
    type: Stepper.TYPE.FOUR_WIRE,
    stepsPerRev: steps,
    pins: {
      motor1: 2,
      motor2: 4,
      motor3: 3,
      motor4: 5,
    },
  });

  stepper2 = new Stepper({
    type: Stepper.TYPE.FOUR_WIRE,
    stepsPerRev: steps,
    pins: {
      motor1: 6,
      motor2: 8,
      motor3: 7,
      motor4: 9,
    },
  });

  stepper3 = new Stepper({
    type: Stepper.TYPE.FOUR_WIRE,
    stepsPerRev: steps,
    pins: {
      motor1: 10,
      motor2: 12,
      motor3: 11,
      motor4: 13,
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

  socket.on("64386c6ff980cacbebdfa6ea", (msg) => {
    console.log("mueve motor: " + msg);
    // socket.emit("movio-motor", "termina movimiento motor");
    if (board.isReady) {
      stepper1
        .rpm(rpm)
        .direction(Stepper.DIRECTION.CCW)
        .accel(accel)
        .decel(decel);

      stepper1.step(steps * rev, () => {
        console.log("Done moving CCW");
        pin2.low();
        pin3.low();
        pin4.low();
        pin5.low();
      });
    }
  });
  //libreta
  socket.on("64386d65e78c00554d4195a6", (msg) => {
    console.log("mueve motor: " + msg);
    // socket.emit("movio-motor", "termina movimiento motor");
    if (board.isReady) {
      stepper2
        .rpm(rpm)
        .direction(Stepper.DIRECTION.CCW)
        .accel(accel)
        .decel(decel);

      stepper2.step(steps * rev, () => {
        console.log("Done moving CCW");
        pin6.low();
        pin7.low();
        pin8.low();
        pin9.low();
      });
    }
  });

  socket.on("64386df4e78c00554d4195aa", (msg) => {
    console.log("mueve motor: " + msg);
    // socket.emit("movio-motor", "termina movimiento motor");
    if (board.isReady) {
      stepper3
        .rpm(rpm)
        .direction(Stepper.DIRECTION.CCW)
        .accel(accel)
        .decel(decel);

      stepper3.step(steps * rev, () => {
        console.log("Done moving CCW");
        pin10.low();
        pin11.low();
        pin12.low();
        pin13.low();
      });
    }
  });
};

module.exports = {
  socketController,
};
