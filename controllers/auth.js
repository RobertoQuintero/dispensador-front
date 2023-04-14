const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/user");

const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - email",
      });
    }

    // SI el usuario está activo
    if (!usuario.status) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const renovarToken = async (req, res = response) => {
  const { usuario } = req;

  // Generar el JWT
  const token = await generarJWT(usuario.id);

  res.json({
    usuario,
    token,
  });
};

module.exports = {
  login,
  renovarToken,
};
