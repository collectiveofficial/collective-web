const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(module.filename);
const dotenv = require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
console.log('THIS IS THE ENV: ', env);
console.log('config.use_env_variable: ', config.use_env_variable);
if (config.use_env_variable) {
  sequelize = new Sequelize(config.use_env_variable);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// sequelize model:create --name User --attributes "firstName:string, lastName:string, email:string, phoneNumber:string, birthday:string, streetAddress:string, aptSuite:string, city:string, state:string, zipCode:integer, fullAddress:string, subscribed:boolean, userGroupId:integer"
