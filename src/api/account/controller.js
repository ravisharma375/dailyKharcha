const Joi = require("joi");
const httpStatus = require("http-status");
const { accountService } = require("./service");
class accountController {
  static async addAccount(req, res) {
    const { body, params } = req;
    const accountSchema = Joi.object({
      accountName: Joi.string().required(),
    });
    try {
      const { error } = await accountSchema.validate(body);
      if (error) {
        return httpError(res, httpStatus.BAD_REQUEST, error.message);
      }
      const createData = await accountService.createAccount(
        body,
        req.user.userId
      );
      if (count >= 8) {
        return httpError(res, httpStatus.BAD_REQUEST, "Limit Expired!");
      }
      if (!createData) {
        return httpError(res, httpStatus.BAD_REQUEST, "Already Exists!");
      }
      return httpSuccess(
        res,
        httpStatus.OK,
        "Account Added Successfully.",
        true
      );
    } catch (error) {
      return httpError(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }
  static async editAccount(req, res) {
    const { body, params, user } = req;
    const accountSchema = Joi.object({
      accountName: Joi.string().required(),
    });
    try {
      const { error } = await accountSchema.validate(body);
      if (error) {
        return httpError(res, httpStatus.BAD_REQUEST, error.message);
      }
      const createData = await accountService.editAccount(
        body,
        params.accountId,
        user.userId
      );
      if (!createData) {
        return httpError(res, httpStatus.BAD_REQUEST, "Already Exists!");
      }
      return httpSuccess(
        res,
        httpStatus.OK,
        "Account Updated Successfully.",
        true
      );
    } catch (error) {
      return httpError(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }
}

module.exports = { accountController };
