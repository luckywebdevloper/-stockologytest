/** @format */
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
dotenv.config({ path: "./.env" });

require("./db/connection");
const app = express();
// const User = require("./model/userSchema");
// Amaan Link the router files to make route easy
app.use(express.json());

app.use(require("./router/auth"));

//  Data Base

const PORT = process.env.PORT;

// Middleaware

app.listen(PORT, () => {
  console.log(`server is running at port no ${PORT}`);
});
