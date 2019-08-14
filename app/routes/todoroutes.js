// let query = `SELECT * from bucket LEFT JOIN  user_bucket_todo ON bucket.bucket_id = user_bucket_todo.bucket_id LEFT JOIN todo ON user_bucket_todo.todo_id = todo.todo_id WHERE user_id = "${
//     userData.user_id
//   }" `
const express = require("express");
const conn = require("../../dbConfig");

const app = express();

app.get("/:id", (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send({ status: 1, message: "Unauthorized" });
  } else {
    //decode token
    let buff = new Buffer(req.headers.authorization, "base64");
    let userData = JSON.parse(buff.toString("ascii"));
    let query = `SELECT  * from bucket LEFT JOIN  user_bucket_todo ON bucket.bucket_id = user_bucket_todo.bucket_id LEFT JOIN todo ON user_bucket_todo.todo_id = todo.todo_id WHERE user_id = "${
      userData.user_id
    }" AND bucket.bucket_id = "${req.params.id}" `;
    conn.query(query, (err, response) => {
      if (!err) {
        res.status(200).send({ status: 0, data: response });
      } else {
        res.status(200).send({ status: 1, message: "cannot get" });
      }
    });
  }
});

module.exports = app;
