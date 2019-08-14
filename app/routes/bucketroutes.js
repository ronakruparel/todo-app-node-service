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
            res.status(200).send({ status: 1, message: "Cannot add" });
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

app.get("/", (req, res) => {
  conn.getConnection((err, sql) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send({ status: 1, message: "Internal Server error" });
    } else {
      if (!req.headers.authorization) {
        //check authrized access
        res.status(401).send({ status: 1, message: "Unauthorized" });
      } else {
        //decode token
        let buff = new Buffer(req.headers.authorization, "base64");
        let userData = JSON.parse(buff.toString("ascii"));
        //join query to get data from association table

        let query = `SELECT * from bucket LEFT JOIN  user_bucket_todo ON bucket.bucket_id = user_bucket_todo.bucket_id WHERE user_id = "${
          userData.user_id
        }" `;

        sql.query(query, (err, response) => {
          if (!err) {
            res.status(200).send({ status: 0, data: response });
          } else {
            res.status(200).send({ status: 1, message: "Cannot get buckets" });
          }
        });
      }
    }
  });
});

app.put("/", (req, res) => {
  conn.getConnection((err, sql) => {
    if (err) {
      console.log(err.stack);
      res.status(500).send({ status: 1, message: "Internal Server error" });
    } else {
      //check access
      if (!req.headers.authorization) {
        res.status(401).send({ status: 1, message: "Unauthorized" });
      } else {
        let buff = new Buffer(req.headers.authorization, "base64");
        let userData = JSON.parse(buff.toString("ascii"));

        let query = `UPDATE bucket SET bucket_name = "${
          req.body.bucket_name
        }" , current_status="${req.body.current_status}" WHERE bucket_id = "${
          req.body.bucket_id
        }"`;

        sql.query(query, (err, response) => {
          if (err) {
            response
              .status(200)
              .send({ status: 1, message: "Cannot update bucket" });
          } else {
            res
              .status(200)
              .send({ status: 0, message: "Updated successfully" });
          }
        });
      }
    }
  });
});

app.delete("/", (req, res) => {
  conn.getConnection((err, sql) => {
    if (err) {
      res.status(500).send({ status: 1, message: "Internal Server error" });
    } else {
      if (!req.headers.authorization) {
        res.status(401).send({ status: 1, message: "Unauthorized" });
      } else {
        let query = `DELETE FROM bucket WHERE bucket_id=${req.body.bucket_id}`;
        sql.query(query, (err, response) => {
          if (err) {
            res.status(200).send({ status: 1, message: "Cannot delete" });
          } else {
            res
              .status(200)
              .send({ status: 0, message: "deleted Successfully" });
          }
        });
      }
    }
  });
});

module.exports = app;
