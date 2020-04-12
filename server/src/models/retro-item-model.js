const retroItemModel = (sequelize, DataTypes) => {
  const retroItem = sequelize.define(
    "retroItems",
    {
      type: DataTypes.ENUM(["GOOD", "BAD", "ACTION", "QUESTION"]),
      text: DataTypes.STRING,
    },
    { timestamps: true }
  );

  retroItem.associate = (models) => {
    retroItem.belongsTo(models.retro);
    retroItem.belongsTo(models.user, { as: "createdBy" });
  };

  return retroItem;
};

export default retroItemModel;
