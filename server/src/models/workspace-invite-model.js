const workspaceInviteModel = (sequelize, DataTypes) => {
  const workspaceInvite = sequelize.define(
    "workspaceInvites",
    {
      email: DataTypes.STRING,
      accepted: DataTypes.BOOLEAN
    },
    { timestamps: true },
    {
      indexes: [
        {
          unique: true,
          fields: ["email", "workspaceId"]
        }
      ]
    }
  );

  workspaceInvite.associate = models => {
    workspaceInvite.belongsTo(models.workspace);
    workspaceInvite.belongsTo(models.user, { as: "invitedBy" });
  };

  return workspaceInvite;
};

export default workspaceInviteModel;
