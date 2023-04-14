const { Purchase } = require("../models");

const getAllPurchase = (req, res) => {
  res.json({
    ok: true,
    msg: "todas las compras",
  });
};

const getPurchasesByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const purchases = await Purchase.find({
      $or: [{ user: id }],
    })
      .populate("product", "price name")
      .sort({ createdAt: "desc" })
      .limit(30);

    const newPurchases = purchases.map((purchase) => {
      const { product, createdAt, quantity } = purchase;
      return {
        name: product.name,
        price: product.price,
        createdAt,
        quantity,
      };
    });

    res.json({
      ok: true,
      purchases: newPurchases,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      ok: false,
      msg: "Problemas en el servidor hable con el administrador",
    });
  }
};

const postPurchasesByUser = async (req, res) => {
  try {
    const purchase = new Purchase(req.body);

    await purchase.save();

    res.json({
      ok: true,
      purchase,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      ok: false,
      msg: "no se pudo realizar la compra",
    });
  }
};

module.exports = {
  getAllPurchase,
  getPurchasesByUser,
  postPurchasesByUser,
};
