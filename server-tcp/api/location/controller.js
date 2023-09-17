const { Router } = require("express");
const dayjs = require("dayjs");

const locationService = require("./service");
const router = Router();

router.get("/", async (req, res, next) => {
  const {
    dateI = new dayjs(0).$d,
    dateF = new dayjs().$d,
    acurracyDegree: acurracy,
    longitude,
    latitude,
  } = req.query;

  const query = {
    gte: new dayjs(dateI).$d,
    lte: new dayjs(dateF).$d,
    acurracy: parseFloat(acurracy),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  };
  if (!(dayjs(query.lte).isValid() && dayjs(query.gte).isValid)) {
    next("Fecha invalida");
  }
  if (query.gte > query.lte) {
    next("rango no valido");
  }
  try {
    const location = await locationService.get(query);
    res.send(location);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { longitude, latitude, timestamp } = req.body;

  try {
    const id = await locationService.addLocation({
      longitude,
      latitude,
      timestamp,
    });
    res.send(id);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
