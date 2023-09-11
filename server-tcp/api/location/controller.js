const { Router } = require("express");
const dayjs = require("dayjs");

const locationService = require("./service");
const router = Router();

router.get("/", async (req, res, next) => {
  const { dateI = new dayjs(0).$d, dateF = new dayjs().$d } = req.query;

  const date = {
    gte: new dayjs(dateI).$d,
    lte: new dayjs(dateF).$d,
  };
<<<<<<< HEAD
=======
  console.log(date);
>>>>>>> b327192 (Configuracion endpoint ubiaciones)
  if (!(dayjs(date.lte).isValid() && dayjs(date.gte).isValid)) {
    next("Fecha invalida");
  }
  if (date.gte > date.lte) {
    next("rango no valido");
  }
  try {
    const location = await locationService.get(date);
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
