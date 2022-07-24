const OS = require("os");
process.env.UV_THREADPOOL_SIZE = OS.cpus().length;
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
const app = express();
require("dotenv").config();
const passport = require("passport");
const flash = require("connect-flash");
const { shutdownDatabase } = require("./src/config/database");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "L^m&SApi%Jk%",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const auth = require("./src/lib/localAuth");

auth.serializeUser();
auth.deserializeUser();
auth.configureStrategy();

app.use("/", indexRouter);
app.use("/users", usersRouter);
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });
// Http Success handler
function httpSuccess(res, statusCode, data, isMsg = false) {
  let response = {
    status: "Success",
  };
  response[`${!isMsg ? "result" : "message"}`] = data;
  res.status(statusCode).send(response);
}
function httpError(res, statusCode, msg) {
  let response = {
    status: "Failed",
    message: msg,
  };
  res.status(statusCode).send(response);
}
global.httpSuccess = httpSuccess;
global.httpError = httpError;
// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
