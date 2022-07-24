function transactionModel(sequelize, DataTypes) {
  let transaction = sequelize.define("transaction", {
    transactionId: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      defaultValue() {
        return `TRANS-${new Date().valueOf()}${Math.floor(
          1000 + Math.random() * 9000
        )}`;
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.ENUM({
        values: ["credit", "debit"],
      }),
      allowNull: false,
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      defaultValue: 0.0,
    },
    adFrom: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
    },
    time: {
      type: DataTypes.TIME,
    },
    note: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });
  return transaction;
}
module.exports = { transactionModel };
