import { sequelize } from "../lib/sequelize";

const models = {
  user: sequelize.import("./user-model"),
  workspace: sequelize.import("./workspace-model")
};

Object.keys(models).forEach(key => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export default models;
