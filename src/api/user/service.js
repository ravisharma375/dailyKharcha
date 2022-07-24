const { User } = require("../../config/database");
class userService {
  static getUserByEmail(username) {
    try {
      const user = User.findOne({
        where: {
          email: username,
        },
      });
      if (user) {
        return user;
      }
      return false;
    } catch (error) {
      return error;
    }
  }
}

module.exports = { userService };
