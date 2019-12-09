const userModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      email: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING
    },
    { timestamps: true }
  );
};

export default userModel;