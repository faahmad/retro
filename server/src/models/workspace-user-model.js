const workspaceUserModel = (sequelize, DataTypes) => {
  const workspaceUser = sequelize.define("workspaceUsers");
  return workspaceUser;
};

export default workspaceUserModel;
