// ««««««««« modules »»»»»»»»»
require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const router = require('./routes.js');

const app = express();
const port = process.env.PORT || 8090;

// ----- Postgres -----
console.log(process.env.POSTGRES_URI)
const sql = new Sequelize(process.env.POSTGRES_DB,
                          process.env.POSTGRES_USER,
                          process.env.POSTGRES_PASS,
                          {
                            host:process.env.POSTGRES_HOST,
                            dialect: 'postgres',
                            protocol:'postgres',
                            port:process.env.POSTGRES_PORT,
                            dialectOptions: {
                              ssl: true
                            }
                          });

const User = sql.define('Users', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  phoneNumber: Sequelize.INTEGER,
  birthday: Sequelize.DATEONLY,
  streetAddress: Sequelize.STRING,
  aptSuite: Sequelize.STRING,
  city: Sequelize.STRING,
  state: Sequelize.STRING,
  zipCode: Sequelize.INTEGER,
  fullAddress: Sequelize.STRING,
  subscribed: Sequelize.BOOLEAN,
  userGroup: Sequelize.STRING
});

sql.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });
sql.sync()
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
