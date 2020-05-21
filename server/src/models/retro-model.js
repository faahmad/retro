const retroModel = (sequelize, DataTypes) => {
  const retro = sequelize.define(
    "retros",
    {
      name: DataTypes.STRING
    },
    { timestamps: true }
  );

  retro.associate = (models) => {
    retro.belongsTo(models.team);
    retro.belongsTo(models.workspace);
    retro.belongsTo(models.user, { as: "createdBy" });
  };

  return retro;
};

export default retroModel;
