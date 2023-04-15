const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  let address = __dirname
    .split("/")
    .filter((item) => item !== "routes")
    .join("/");

  res.sendFile(address + "/public/index.html");
});

module.exports = router;
