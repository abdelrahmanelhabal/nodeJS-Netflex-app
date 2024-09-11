const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const app = express();
app.use(express.json());
mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("Database connect successfuly!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

const server = app.listen(process.env.PORT || 8000, () => {
  console.log("server running successfuly!");
});
