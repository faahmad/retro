import { sequelize } from "../lib/sequelize";

const models = {
  user: sequelize.import("./user-model"),
  workspace: sequelize.import("./workspace-model"),
  team: sequelize.import("./team-model"),
  workspaceInvite: sequelize.import("./workspace-invite-model"),
  retro: sequelize.import("./retro-model"),
  retroItem: sequelize.import("./retro-item-model")
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export default models;
