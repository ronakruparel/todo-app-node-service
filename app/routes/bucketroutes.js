const express = require("express");
const conn = require("../../dbConfig");

const app = express();

app.post("/", (req, res) => {
  conn.getConnection((err, sql) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send({ status: 1, message: "Internal Server error" });
    } else {
      //Check authorized access

      if (!req.headers.authorization) {
        res.status(401).send({ status: 1, message: "Unauthorized" });
      } else {
        //decode token
        let buff = new Buffer(req.headers.authorization, "base64");
        let userData = JSON.parse(buff.toString("ascii"));
        const values = {
          bucket_name: req.body.bucket_name
        };
        let query = `INSERT INTO bucket SET bucket_name = "${
          values.bucket_name
        }"`;

        sql.query(query, (err, res) => {
          if (err) {
            console.log("insert bucket", err.stack);
          } else {
            let query = `INSERT INTO user_bucket_todo SET user_id="${
              userData.user_id
            } ", bucket_id="${res.insertId}"`;

            sql.query(query, (err, res) => {
              if (err) {
                console.log(err.stack);
              }
            });
          }
        });
      }
      res.status(200).send({ status: 0, message: "bucket added successfully" });
    }
  });
});

module.exports = app;
