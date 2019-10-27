import Sequelize from "sequelize";

export const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  null,
  {
    dialect: "postgres"
  }
);
