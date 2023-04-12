const { Board, Motor } = require("johnny-five");
const board = new Board();

board.on("ready", () => {
  // Create a new `motor` hardware instance.
  const motor = new Motor({
    pin: 5,
  });

  board.repl.inject({
    motor,
  });

  // Motor Event API

  // "start" events fire when the motor is started.
  motor.on("start", () => {
    console.log(`start: ${Date.now()}`);

    // Demonstrate motor stop in 2 seconds
    board.wait(2000, motor.stop);
  });

  // "stop" events fire when the motor is stopped.
  motor.on("stop", () => {
    console.log(`stop: ${Date.now()}`);
  });

  motor.start();
});
