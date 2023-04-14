const { User, Product } = require("../models");

const emailExiste = async (email = "") => {
  // Verificar si el email existe
  const existeEmail = await User.findOne({ email });
  if (existeEmail) {
    throw new Error(`El email: ${email}, ya está registrado`);
  }
};

const existeUsuarioPorId = async (id) => {
  // Verificar si el email existe
  const existeUsuario = await User.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe ${id}`);
  }
};

const existeProductoPorId = async (id) => {
  // Verificar si el email existe
  const existeProducto = await Product.findById(id);
  if (!existeProducto) {
    throw new Error(`El id no existe ${id}`);
  }
};

module.exports = {
  emailExiste,
  existeUsuarioPorId,
  existeProductoPorId,
};
