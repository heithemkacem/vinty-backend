require("dotenv").config();
const express = require("express");
require("./src/config/db");
const routes = require("./src/routes/routes");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(routes);

module.exports = app;
