const {
  Account,
  Transaction,
  Op,
  sequelize,
} = require("../../config/database");
class transactionService {
  static async getBalance(userId, accountId) {
    try {
      const getAccountBalance = await Account.findOne({
        where: {
          userId: userId,
          accountId: accountId,
          isActive: true,
        },
      });
      return getAccountBalance;
    } catch (error) {
      throw error;
    }
  }
  static async addNote(body, userId, traAmount) {
    // Add & Remove Amount From Selected Account - update in Account
    // Add in transaction table - Add In Transaction
    const t = await sequelize.transaction();
    try {
      console;
      let payload = {
        userId: userId,
        transactionType: body.transactionType,
        accountId: body.accountId,
        amount: body.amount,
        adFrom: body.adFrom,
        date: body.date,
        time: body.time,
        note: body.note,
      };
      console.log(payload,"-=-=-=-=-=-=-=-=-=-===-=-")
      let addTransaction = await Transaction.create(payload, {
        transaction: t,
      });
      if (addTransaction) {
        await Account.update(
          { amount: traAmount },
          {
            where: {
              userId: userId,
              accountId: body.accountId,
            },
          },
          { transaction: t }
        );
        if (body.adFrom > 0) {
          let accountBalance = await transactionService.getBalance(
            userId,
            body.adFrom
          );
          await Account.update(
            { amount: Number(accountBalance.amount) - Number(body.amount) },
            {
              where: {
                userId: userId,
                accountId: body.adFrom,
              },
            },
            { transaction: t }
          );
          // remove or Add amount from adFrom Account to AccountId
        }
      }
      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
module.exports = {
  transactionService,
};
