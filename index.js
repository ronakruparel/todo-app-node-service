const express = require("express");
const conn = require("./dbConfig");

const app = express();
const bodyParser = require("body-parser");
const PORT = 9000;


//connect db
conn.getConnection(err => {
  if (!err) {
    console.log("Connected to Database");
  } else {
    console.log(err);
  }
});

var auth = require("./app/routes/authroutes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




app.use("/login", auth);

//Configure Node server to PORT 9000
app.listen(process.env.PORT || PORT, () => {
  console.log(`PORT Listening to ${PORT}`);
});
