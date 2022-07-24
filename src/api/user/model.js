const { createHash } = require("crypto");

function userModel(sequelize, DataTypes) {
  let user = sequelize.define("user", {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });
  user.hashPassword = function (password) {
    return createHash("sha256").update(password).digest("hex");
  };
  user.prototype.validatePassword = function (hash, password) {
    return createHash("sha256").update(password).digest("hex") === hash
      ? true
      : false;
  };
  return user;
}
module.exports = { userModel };
