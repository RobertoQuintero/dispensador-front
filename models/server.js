const express = require("express");
const cors = require("cors");

const { dbConnection } = require("../database/config");
const { socketController } = require("../sockets/socketController");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = require("http").createServer(this.app);
    this.io = require("socket.io")(this.server);

    this.paths = {
      auth: "/api/auth",
      productos: "/api/productos",
      usuarios: "/api/usuarios",
      compras: "/api/compras",
      screens: "/",
    };

    // Conectar a base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();

    //eventos de sockets
    this.sockets();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio Público
    this.app.use(express.static("public"));
  }

  routes() {
    // this.app.use(this.paths.screens, require("../routes/screens"));
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.productos, require("../routes/products"));
    this.app.use(this.paths.usuarios, require("../routes/users"));
    this.app.use(this.paths.compras, require("../routes/purchases"));
  }

  sockets() {
    this.io.on("connection", (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
