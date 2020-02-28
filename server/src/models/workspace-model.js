const workspaceModel = (sequelize, DataTypes) => {
  const workspace = sequelize.define(
    "workspaces",
    {
      name: DataTypes.STRING,
      iconUrl: DataTypes.STRING,
      url: { type: DataTypes.STRING, unique: true },
      allowedEmailDomain: DataTypes.STRING
    },
    { timestamps: true }
  );

  workspace.associate = models => {
    workspace.belongsTo(models.user, { as: "owner" });
    workspace.belongsToMany(models.user, { through: "workspaceUsers" });
  };

  return workspace;
};

export default workspaceModel;
