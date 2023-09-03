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
  dialectOptions: {
    ssl: {
      require: true, // This will help you. But you will see nwe error
      rejectUnauthorized: false // This line will fix new error
    }
  },
});

Location.init(LocationSchema, Location.config(sequelize));

sequelize.sync();

module.exports = sequelize;
