const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const bodyParser = require("body-parser");
const PORT = 9000;

var auth = require("./app/routes/authroutes");
var buckets = require("./app/routes/bucketroutes");
var todo = require("./app/routes/todoroutes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/login", auth);
app.use("/bucket", buckets);
app.use("/todo", todo);

//Configure Node server to PORT 9000
app.listen(process.env.PORT || PORT, () => {
  console.log(`PORT Listening to ${PORT}`);
});
