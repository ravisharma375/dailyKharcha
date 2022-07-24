const express = require("express");
const router = express.Router();
const moment = require("moment");
// const uiController = require("./uiController");
const {
  Account,
  Transaction,
  Op,
  sequelize,
} = require("../src/config/database");
Account.hasMany(Transaction, { foreignKey: "accountId" });
Transaction.belongsTo(Account, { foreignKey: "accountId" });
const { accountController } = require("../src/api/account/controller");
const {
  transactionController,
} = require("../src/api/transactionAndNote/controller");
const passport = require("passport");
const auth = require("../src/lib/localAuth");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
/* GET home page. */

router.use(function (req, res, next) {
  res.locals.message = req.flash();
  next();
});
// router.use("/", uiController);

router.get("/", (req, res) => {
  res.render("index", {
    loggedOut: "no",
    title: "Login",
    error: res.locals.message,
  });
});
router.get("/login", (req, res) => {
  res.render("index", {
    loggedOut: "no",
    title: "Login",
    error: res.locals.message,
  });
});
router.post(
  "/Login",
  passport.authenticate("local", {
    failureRedirect: "/Login?err",
    failureFlash: true,
  }),
  function (req, res) {
    const { user } = req;
    if (user) {
      res.redirect("/dashboard");
    }
    // res.redirect("/");
  }
);
router.get(
  "/dashboard",
  auth.ensureAdminAuthenticated,
  async function (req, res, next) {
    let { user } = req;
    const getAllAccount = await Account.findAll({
      where: {
        userId: user.userId,
        isActive: true,
      },
    });
    const getLastFiveTransaction = await Transaction.findAll({
      include: [
        {
          model: Account,
          foreignKey: "accountId",
        },
      ],
      where: {
        userId: user.userId,
        isActive: true,
      },
      order: [
        ["createdAt", "DESC"],
      ],
      limit: 5,
    });
    getAllAccount.forEach((element) => {
      element.amount = Number(element.amount).toLocaleString();
    });
    let transaction = [];
    getLastFiveTransaction.forEach((item) => {
      transaction.push({
        transactionType: item.transactionType,
        accountName:item.account.accountName,
        accountId: item.accountId,
        amount: item.amount,
        date: moment(item.date, "YYYY-MM-DD").format("DD-MM-YYYY"),
        note: item.note == null ? "NA" : item.note,
      });
    });
    res.render("layout", {
      page: "dashboard",
      title: "Express",
      fullName: user.fullName,
      email: user.email,
      account: getAllAccount,
      transaction: transaction,
    });
  }
);
router.get(
  "/accounts",
  auth.ensureAdminAuthenticated,
  async function (req, res, next) {
    let { user } = req;
    const getAllAccount = await Account.findAll({
      where: {
        userId: user.userId,
      },
    });
    res.render("layout", {
      page: "accounts",
      title: "Express",
      fullName: user.fullName,
      account: getAllAccount,
      // email: user.email,
    });
  }
);
router.post(
  "/account",
  auth.ensureAdminAuthenticated,
  accountController.addAccount
);
router.patch("/account/:accountId", accountController.editAccount);
router.post("/transaction", transactionController.addNote);
router.post("/logout", (req, res) => {
  req.logOut();
});
module.exports = router;
