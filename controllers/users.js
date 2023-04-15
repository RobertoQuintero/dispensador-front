const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { status: true };

  const [total, usuarios] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const getUsuarioById = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      ok: false,
      msg: "usuario no encontrado",
    });
  }
};

const usuariosPost = async (req, res = response) => {
  try {
    const { name, email, password, rol, ctrlnum } = req.body;
    const usuario = new User({ name, email, password, rol, ctrlnum });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();

    res.json({
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "error al guardar usuario",
    });
  }
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await User.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;
  const usuario = await User.findByIdAndUpdate(id, { estado: false });

  res.json(usuario);
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  getUsuarioById,
};
