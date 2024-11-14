
require('dotenv').config();
const express = require('express');
 require('./src/config/db');
const routes = require('./src/routes/routes')


const app = express();
app.use(express.json());


app.use('/auth-api', routes);


module.exports = app;
