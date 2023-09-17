const { models } = require("./../../db");
const { Op } = require("sequelize");

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

async function get(query) {
  const where = {
    timestamp: {
      [Op.lte]: query.lte,
      [Op.gte]: query.gte,
    },
  };
  if (!!query.acurracy && query.acurracy > 0) {
    where.longitude = {
      [Op.gte]: query.longitude - query.acurracy,
      [Op.lte]: query.longitude + query.acurracy,
    };
    where.latitude = {
      [Op.gte]: query.latitude - query.acurracy,
      [Op.lte]: query.latitude + query.acurracy,
    };
  }

  const location = await models.Location.findAll({
    where: where,
    order: [["timestamp", "ASC"]],
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
  get,
  getLast,
};
