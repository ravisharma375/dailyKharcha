const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../config/database");

module.exports.serializeUser = function () {
  "use strict";
  passport.serializeUser(function (user, done) {
    done(null, user.userId);
  });
};

module.exports.deserializeUser = function () {
  "use strict";
  passport.deserializeUser(function (id, done) {
    User.findByPk(id, {})
      .then(function (user) {
        // user.token = jwt.sign({ firstName: user.firstName, emailId: user.emailId }, secret, { expiresIn: '1d' })
        done(null, user);
      })
      .catch(function (err) {
        done(err, false);
      });
  });
};

/**
 * Configure the strategy passport should use
 */
module.exports.configureStrategy = function () {
  "use strict";
  passport.use(
    new LocalStrategy(function (username, password, done) {
      //console.log(username);
      passReqToCallback: true,
        User.findOne({
          where: {
            email: username,
          },
        }).then(function (user) {
          if (!user) {
            return done(null, false, { message: "User doesn't exist" });
          }
          if (!user.validatePassword(user.password, password)) {
            return done(null, false, { message: "Password does not match" });
          }
          return done(null, user);
        });
    })
  );
};

module.exports.ensureAdminAuthenticated = function (req, res, next) {
  "use strict";
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/Login");
};
