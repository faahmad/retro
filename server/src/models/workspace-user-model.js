const workspaceUserModel = (sequelize, DataTypes) => {
  const workspaceUser = sequelize.define(
    "workspaceUsers",
    {
      workspaceId: {
        type: DataTypes.INTEGER,
        references: {
          model: "workspaces",
          key: "id"
        },
        allowNull: false
      },
      userId: {
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

  return workspaceUser;
};

export default workspaceUserModel;
