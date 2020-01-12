const userModel = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "users",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      email: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING
    },
    { timestamps: true }
  );

  user.associate = models => {
    user.belongsToMany(models.workspace, { through: "workspaceUsers" });
    user.belongsToMany(models.team, { through: "teamUsers" });
  };

  return user;
};

export default userModel;
