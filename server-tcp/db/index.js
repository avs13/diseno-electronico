const { Sequelize } = require("sequelize");
const { Location, LocationSchema } = require("./location");
const config = require("./../config/");

const USER = encodeURIComponent(config.db.user);
const PASSWORD = encodeURIComponent(config.db.password);

const URI = `postgres://${USER}:${PASSWORD}@${config.db.host}:${config.db.port}/${config.db.name}`;

const sequelize = new Sequelize(URI, {
  dialect: "postgres",
  logging: true,
  timezone: "-05:00",
});

Location.init(LocationSchema, Location.config(sequelize));

sequelize.sync();

module.exports = sequelize;
