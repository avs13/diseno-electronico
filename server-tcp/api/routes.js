const { Router } = require("express");
const location = require("./location/controller");

const router = Router();

router.use("/location", location);

module.exports = router;
