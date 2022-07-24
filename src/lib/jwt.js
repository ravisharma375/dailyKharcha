const jwt = require("jsonwebtoken");
async function jwtToken(user) {
  try {
    let token = await jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.log(error);
  }
}
module.exports = { jwtToken };
