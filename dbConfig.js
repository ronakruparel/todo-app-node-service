const mysql = require("mysql");

//DB config
const conn = mysql.createPool({
  connectionLimitL: 10,
  host: "localhost",
  user: "admin",
  password: "admin123",
  database: "todoapp"
});

conn.getConnection(err => {
  if (!err) {
    console.log("Connected to Database");
  } else {
    console.log(err);
  }
});
module.exports = conn;
