'use strict';
var db = require('../models/index');

module.exports = {
  up: function(queryInterface, Sequelize) {
    return db.sequelize.model('Dropoff').sync({ force: true }); // development only: needs to change for production
  },
  up_create_table: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Dropoffs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      groupID: {
        type: Sequelize.INTEGER
      },
      ballotID: {
        type: Sequelize.INTEGER
      },
      shipDate: {
        type: Sequelize.DATE
      },
      voteDateBeg: {
        type: Sequelize.DATE
      },
      voteDateEnd: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Dropoffs');
  }
};
