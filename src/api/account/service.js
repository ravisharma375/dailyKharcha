const { Account, Op } = require("../../config/database");

class accountService {
  static async getAccount(userId) {
    try {
      const getAllAccount = Account.findAll({
        where: {
          userId: userId,
        },
      });
      return getAllAccount;
    } catch (error) {
      return error;
    }
  }

  // Function Used To Create User Account --------
  static async createAccount(body, userId) {
    try {
      const count = await Account.count({
        where: {
          userId: userId,
        },
      });
      if (count > 7) {
        return count;
      }
      const findAccount = await Account.findOne({
        where: {
          accountName: body.accountName,
          userId: userId,
        },
      });
      if (findAccount) {
        return false;
      }
      await Account.create({
        userId: userId,
        accountName: body.accountName,
      });
      return true;
    } catch (error) {
      return error;
    }
  }
  static async editAccount(body, accountId, userId) {
    try {
      const checkExist = await Account.findOne({
        where: {
          userId: userId,
          accountName: body.accountName,
          accountId: {
            [Op.not]: accountId,
          },
        },
      });
      if (!checkExist) {
        await Account.update(body, {
          where: {
            accountId: accountId,
          },
        });
        return true;
      }
      return false;
    } catch (error) {
      return error;
    }
  }
  static async deleteAccount() {
    try {
    } catch (error) {}
  }
}
module.exports = { accountService };
