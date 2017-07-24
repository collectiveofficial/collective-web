// ««««««««« modules »»»»»»»»»
const dotenv = require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes.js');

const app = express();
const port = process.env.PORT || 8090;

// ----- Parsing -----
app.use(bodyParser.json());
app.use(bodyParser.json({ entended: true }));

app.use('/', express.static(path.join(__dirname, '../client/public')));

// ----- Setup routes ------
app.use('/', router);

// ----- start app -----
app.listen(port, () => {
  console.log(`Collective app is listening at port:  ${port}`);
});

module.exports = app;
