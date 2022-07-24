const convict = require("convict");
// convict.addFormat(require("convict-format-with-validator").ipaddress);
const { String } = require("joi");
const config = convict({
  env: {
    doc: "The application environment.",
    default: "development",
    env: "NODE_ENV",
  },
  port: {
    doc: "The port to bind.",
    default: 300,
    env: "PORT",
    arg: "port",
  },
  db: {
    host: {
      doc: "Database host name/IP",
      default: "server1.dev.test",
      env: "DATABASE_HOST",
      arg: "database host",
    },
    port: {
      doc: "Database portP",
      default: "3306",
      env: "DATABASE_PORT",
      arg: "database port",
    },
    name: {
      doc: "Database name",
      default: "xyz",
      env: "DATABASE_NAME",
    },
    username: {
      doc: "Database username",
      default: "xyz",
      env: "DATABASE_USERNAME",
    },
    password: {
      doc: "Database password",
      default: "xyz",
      env: "DATABASE_PASSWORD",
    },
    dialect: {
      doc: "Database dialect",
      default: "xyz",
      env: "DATABASE_DIALECT",
    },
  },
});
// Load environment dependent configuration
var env = config.get('env');
config.loadFile('./config/' + env + '.json');

// Perform validation
// config.validate({allowed: 'strict'});
module.exports = { config };
