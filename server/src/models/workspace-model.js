const workspaceModel = (sequelize, DataTypes) => {
  const workspace = sequelize.define(
    "workspaces",
    {
      name: DataTypes.STRING,
      iconUrl: DataTypes.STRING,
      url: { type: DataTypes.STRING, unique: true },
      allowedEmailDomain: DataTypes.STRING,
      ownerId: {
        type: DataTypes.STRING,
        references: {
          model: "users",
          key: "id"
        },
        allowNull: false
      }
    },
    { timestamps: true }
  );

  return workspace;
};

export default workspaceModel;
