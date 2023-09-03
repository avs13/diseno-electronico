const { Model, DataTypes, Sequelize } = require("sequelize");

const LOCATION_TABLE = "locations";

const LocationSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  longitude: {
    allowNull: false,
    type: DataTypes.DOUBLE,
  },
  latitude: {
    allowNull: false,
    type: DataTypes.DOUBLE,
  },
  timestamp: {
    allowNull: false,
    type: DataTypes.DATE,
  },
};

class Location extends Model {
  static config(sequelize) {
    return {
      sequelize,
      tableName: LOCATION_TABLE,
      ModelName: "location",
      // timestamps: true,
    };
  }
}

module.exports = {
  LOCATION_TABLE,
  LocationSchema,
  Location,
};
