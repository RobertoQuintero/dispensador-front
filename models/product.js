const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  price_stripe: {
    type: String,
    required: [true, "El precio de stripe es obligatorio"],
  },
  description: { type: String },
  img: { type: String },
});

ProductSchema.methods.toJSON = function () {
  const { __v, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
};

module.exports = model("Product", ProductSchema);
