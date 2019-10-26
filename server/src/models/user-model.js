const userModel = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    email: {
      type: DataTypes.STRING
    },
    googleAccountId: {
      type: DataTypes.STRING
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.FLOAT
    },
    updatedAt: {
      type: DataTypes.FLOAT
    }
  });

  return User;
};

export default userModel;
