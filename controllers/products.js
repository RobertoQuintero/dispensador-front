const { response } = require("express");
const { Product } = require("../models");

const obtenerProductos = async (req, res = response) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "error al cargar productos",
    });
  }
};

const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Product.findById(id);

  res.json(producto);
};

const crearProducto = async (req, res = response) => {
  const { status, ...body } = req.body;

  const productoDB = await Product.findOne({ name: body.name });

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.name}, ya existe`,
    });
  }

  // Generar la data a guardar
  const data = {
    ...body,
    name: body.name.toUpperCase(),
  };

  const producto = new Product(data);

  // Guardar DB
  await producto.save();

  res.status(201).json(producto);
};

const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { status, usuario, ...data } = req.body;

  try {
    if (data.name) {
      data.name = data.name.toUpperCase();
    }
    // data.usuario = req.usuario._id;
    const producto = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json({
      ok: true,
      producto,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      ok: false,
      msg: "Error al actualizar el producto",
    });
  }
};

const borrarProducto = async (req, res = response) => {
  const { id } = req.params;
  const productoBorrado = await Product.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json(productoBorrado);
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};
