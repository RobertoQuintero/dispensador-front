const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT, validarCampos } = require("../middlewares");
const {
  getAllPurchase,
  getPurchasesByUser,
  postPurchasesByUser,
} = require("../controllers/purchases");

const router = Router();

router.get("/", getAllPurchase);
router.post("/", postPurchasesByUser);
router.get("/:id", getPurchasesByUser);

module.exports = router;
