const Joi = require("joi");
const httpStatus = require("http-status");
const { userService } = require("./service");
const { createHash } = require("crypto");
const { jwtToken } = require("../../lib/jwt");
class userController {
  static async login(req, res) {
    let { username, password } = req.body;
    let userSchema = Joi.object({
      username: Joi.string().email().required(),
      password: Joi.string().min(6).max(15).required(),
    });
    try {
      const { error } = await userSchema.validate(req.body);
      if (error) {
        return httpError(res, httpStatus.BAD_REQUEST, error.message);
      }
      const userData = await userService.getUserByEmail(username);
      if (!userData) {
        return httpError(res, httpStatus.BAD_REQUEST, "Invalid username");
      }
      if (
        createHash("sha256", process.env.JWT_SECRET)
          .update(password)
          .digest("hex") === userData.password
      ) {
        let decodeData = {
          userId: userData.userId,
          email: userData.email,
          fullName: userData.fullName,
        };
        let token = await jwtToken(decodeData);
        return httpSuccess(res, httpStatus.OK, {
          token: token,
        });
      }
      return httpError(res, httpStatus.BAD_REQUEST, "Invalid Password");
    } catch (error) {
      return httpError(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }
}
module.exports = { userController };
