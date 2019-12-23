const userModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      email: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING
    },
    { timestamps: true }
  );
};

export default userModel;
