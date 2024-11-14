
require('./src/Config/db');
const express = require('express');
require('dotenv').config();
const app = express();
const routes = require('./src/Routes/Routes')
app.use(express.json());

app.use('/client-api',routes)



module.exports = app;   