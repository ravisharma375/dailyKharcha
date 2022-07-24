const Sequelize = require("sequelize");
const { Op } = Sequelize;
// const { config } = require("./index");
const { createHash, randomUUID } = require("crypto");
const { userModel } = require("../api/user/model");
const { accountModel } = require("../api/account/model");
const { transactionModel } = require("../api/transactionAndNote/model");
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
    logging: console.log,
    sync: false,
    //India TimeZone Change
    timezone: "+5:30",
    dialectOptions: {
      timezone: "local",
    },
    pool: {
      max: 5,
      min: 0,
      idle: 100,
    },
  }
);

const User = userModel(sequelize, Sequelize);
const Account = accountModel(sequelize, Sequelize);
const Transaction = transactionModel(sequelize, Sequelize);
// User.create({
//   userId: randomUUID(),
//   fullName: "Ravi Sharma",
//   email: "itsRavi36.sharma@gmail.com",
//   password: createHash("sha256", process.env.JWT_SECRET).update('ravi@123').digest('hex'),
// });
if (process.env.NODE_ENV === "development") {
  sequelize
    .sync({ force: false })
    .then(() => {
      console.log("Sequelize running in sync mode");
    })
    .catch((error) => {
      throw error;
    });
} else {
  // Temporary. Use migrations in production
  sequelize
    .sync({ force: false })
    .then(() => {
      console.log("Sequelize running in alter mode");
    })
    .catch((error) => {
      throw error;
    });
}

const shutdownDatabase = () => {
  sequelize.close();
};

module.exports = {
  sequelize,
  Op,
  shutdownDatabase,
  User,
  Account,
  Transaction,
};
