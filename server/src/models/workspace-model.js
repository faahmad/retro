const workspaceModel = (sequelize, DataTypes) => {
  const workspace = sequelize.define(
    "workspaces",
    {
      name: DataTypes.STRING,
      iconUrl: DataTypes.STRING
    },
    { timestamps: true }
  );
  workspace.associate = models => {
    workspace.belongsTo(models.user, { as: "owner" });
  };

  return workspace;
};

export default workspaceModel;

// has one name
// has one iconUrl
// has one Owner (foreign_key)
// has many Teams
// has many Retros
