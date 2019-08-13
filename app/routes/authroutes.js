const express = require("express");
const conn = require("../../dbConfig");

const app = express();

app.post("/", (req, res) => {
  conn.getConnection((err, sql) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send({ status: 1, message: "Internal Server error" });
    } else {
      //GET user query
      let query = `SELECT * FROM users WHERE username = "${
        req.body.username
      }" && password="${req.body.password}"`;

      //Query processing
      sql.query(query, (err, rows) => {
        if (err) {
          res.status(403).send({ status: 1, message: "Invalid user" });
        } else {
          if (rows.length === 1) {
            //we can use JWT Token

            //send user details with token
            let buff = new Buffer(JSON.stringify(rows[0]));
            let token = buff.toString("base64");
            res.status(200).send({ status: 0, data: { user: rows[0], token } });
          } else {
            //No user found
            res.status(200).send({ status: 1, message: "No user found" });
          }
        }
      });
    }
  });
});

module.exports = app;
