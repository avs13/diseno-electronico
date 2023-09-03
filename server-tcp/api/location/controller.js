const { Router } = require("express");
const locationService = require("./service");
const router = Router();

router.get("/", async (req, res, next) => {
  res.send("ok");
});

router.post("/", async (req, res, next) => {
  const { longitude, latitude, timestamp } = req.body;

  try {
    const id = await locationService.addLocation({
      longitude,
      latitude,
      timestamp,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
