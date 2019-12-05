import Sequelize from "sequelize";

let config = {
  dialect: "postgres"
};

if (
  process.env.INSTANCE_CONNECTION_NAME &&
  process.env.NODE_ENV === "production"
) {
  const instancePath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
  config.host = instancePath;
  config.dialectOptions = {
    socketPath: instancePath
  };
}

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  config
);
