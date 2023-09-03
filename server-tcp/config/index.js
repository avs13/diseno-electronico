require("dotenv").config();
const config = {
  serversPorts: {
    http: process.env.PORT_HTTP | 80,
    tcp:  process.env.PORT_TCP | 81
  },
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
};

module.exports = config;
