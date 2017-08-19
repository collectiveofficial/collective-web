'use strict';
var db = require('../models/index');
const dbUtils = require('../utils/dbUtils');
var liveTableName = 'Dropoffs';
var sequelizeModelName = 'Dropoff';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return dbUtils.createUpdatedModelMigrations(queryInterface, sequelizeModelName, liveTableName, Sequelize);
  },
  remove: function(queryInterface, Sequelize) {
    dbUtils.removeModelDiffsFromDatabase(queryInterface, liveTableName, sequelizeModelName);
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Dropoffs');
  }
};
