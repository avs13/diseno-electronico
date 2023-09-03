const { models } = require("./../../db");

async function getLast() {
  const location = await models.Location.findOne({
    order: [["id", "DESC"]],
  });
  return location;
}
async function findByTimestamp(timestamp) {
  const location = await models.Location.findOne({
    where: {
      timestamp,
    },
  });
  return location;
}

async function add(location) {
  const exist = await findByTimestamp(location.timestamp);
  if (exist) {
    throw new Error("Ya existe la ubicacion");
  }
  const newLocation = await models.Location.create(location);
  return newLocation;
}

async function findAll(query = {}, search) {
  const locations = await models.Location.findAndCountAll();
  return locations;
}

module.exports = {
  add,
  findAll,
  getLast,
};
