const teamModel = (sequelize, DataTypes) => {
  const team = sequelize.define(
    "teams",
    {
      name: DataTypes.STRING,
      url: DataTypes.STRING
    },
    { timestamps: true }
  );

  team.associate = (models) => {
    team.belongsTo(models.workspace);
  };

  return team;
};

export default teamModel;
