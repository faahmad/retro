const userModel = (sequelize, DataTypes) => {
  return sequelize.define("users", {
    email: DataTypes.STRING,
    googleAccountId: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
};

export default userModel;
