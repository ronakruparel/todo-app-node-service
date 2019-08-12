const express = require("express");
const connection = require("./dbConfig");
const PORT = 9000;

const app = express();

//Configure Node server to PORT 9000
app.listen(process.env.PORT || PORT, () => {
  console.log(`PORT Listening to ${PORT}`);
});

///Connnect Database
connection.getConnection(err => {
  if (!err) {
    console.log("Connected to Database");
  } else {
    console.log(err);
  }
});
