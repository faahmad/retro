import Sequelize from "sequelize";

const isProd = process.env.NODE_ENV === "production";

let config = {
  dialect: "postgres"
};

if (isProd) {
  const instancePath = `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`;
  config.host = instancePath;
  config.dialectOptions = {
    socketPath: instancePath
  };
}

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  isProd ? process.env.DB_PASSWORD : null,
  config
);
