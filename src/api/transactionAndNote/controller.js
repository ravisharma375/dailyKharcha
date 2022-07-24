const Joi = require("joi");
const moment = require("moment");
const httpStatus = require("http-status");
const { transactionService } = require("./service");

class transactionController {
  static async addNote(req, res) {
    // Add & Remove Amount From Selected Account - update in Account
    // Add in transaction table - Add In Transaction
    const { body, user } = req;
    const transactionSchema = Joi.object({
      transactionType: Joi.string().valid("C", "D").required(),
      accountId: Joi.number().positive().required(),
      amount: Joi.number().positive().required(),
      adFrom: Joi.number().required(),
      note: Joi.string().required(),
    });
    try {
      const { error } = transactionSchema.validate(body);
      if (error) {
        return httpError(res, httpStatus.BAD_REQUEST, error.message);
      }
      let { userId } = user;
      const getAccountBalance = await transactionService.getBalance(
        userId,
        body.accountId
      );
      if (!getAccountBalance) {
        return httpError(
          res,
          httpStatus.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        );
      }

      let traAmount;
      if (body.transactionType === "C") {
        body.transactionType = "credit";
        traAmount = Number(getAccountBalance.amount) + Number(body.amount);
      } else if (Number(getAccountBalance.amount) >= Number(body.amount)) {
        body.transactionType = "debit";
        traAmount = Number(getAccountBalance.amount) - Number(body.amount);
      } else {
        return httpSuccess(
          res,
          httpStatus.OK,
          "InSufficent Fund in selected Account.",
          true
        );
      }
      let transactionPayload = {
        ...body,
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("HH:mm"),
      };
      console.log(transactionPayload)
      const addTransaction = await transactionService.addNote(
        transactionPayload,
        userId,
        traAmount
      );
      if (!addTransaction) {
        return httpError(res, httpStatus.BAD_REQUEST, "something went wrong!");
      }
      return httpSuccess(
        res,
        httpStatus.OK,
        "Transaction Added Successfully.",
        true
      );
    } catch (error) {
      console.log(error);
      return httpError(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }
  static async getTransaction(req, res) {
    try {
    } catch (error) {}
  }
  static async editTransaction(req, res) {
    try {
    } catch (error) {}
  }
  static async deleteTransaction(req, res) {
    try {
    } catch (error) {}
  }
}
module.exports.transactionController = transactionController;
