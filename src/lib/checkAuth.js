const jwt = require("jsonwebtoken");
function checkAuth(req, res, next) {
  try {
    const { headers } = req;
    const header = headers.authorization;
    console.log(typeof header )
    if (typeof header != undefined) {
        let token = header.split(" ")
        console.log(token)
      jwt.verify(token[1], process.env.JWT_SECRET, function (err, decode) {
        if (err) {
          return res.status(500).send({
            message: "UNAUTHORIZED",
          });
        }
        req.user = decode;
        next();
      });
    }
    return res.status(500).send({
      message: "UNAUTHORIZED",
    });
  } catch (error) {
    return res.status(500).send({
      message: "UNAUTHORIZED",
    });
  }
}
module.exports = { checkAuth };
