require("dotenv").config();

const nonProductionOptions = {
  username: "me",
  database: "retro_dev",
  host: "127.0.0.1",
  dialect: "postgres"
};
const productionInstancePath =
  "/cloudsql/" + process.env.INSTANCE_CONNECTION_NAME;

module.exports = {
  development: {
    ...nonProductionOptions
  },
  test: {
    ...nonProductionOptions,
    database: "retro_test"
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: productionInstancePath,
    dialectOptions: {
      socketPath: productionInstancePath
    },
    dialect: "postgres"
  }
};
