const { Router } = require("express");
const location = require("./location/controller");

const router = Router();

router.use("/Location", location);

module.exports = router;
