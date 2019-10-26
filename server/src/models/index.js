import Sequelize from "sequelize";

export const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  null,
  {
    dialect: "postgres"
  }
);

export const models = {
  User: sequelize.import("./user-model")
};

Object.keys(models).forEach(key => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});
