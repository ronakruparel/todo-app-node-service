const mysql = require("mysql");

//DB config
const conn = mysql.createPool({
  connectionLimitL: 10,
  host: "localhost",
  user: "admin",
  password: "admin123",
  database: "todoapp"
});

module.exports = conn;
