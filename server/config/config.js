require("dotenv").config();

module.exports = {
  development: {
    username: "me",
    database: "retro_dev",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  test: {
    username: "me",
    database: "retro_test",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: "postgres"
  }
};
