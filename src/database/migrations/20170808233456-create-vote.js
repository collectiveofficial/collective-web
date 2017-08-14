'use strict';
var db = require('../models/index');

module.exports = {
  up: function(queryInterface, Sequelize) {
    return db.sequelize.model('Vote').sync({ force: true }); // development only: needs to change for production
  },
  up_create_table: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userID: {
        type: Sequelize.INTEGER
      },
      foodID: {
        type: Sequelize.INTEGER
      },
      dropoffID: {
        type: Sequelize.INTEGER
      },
      voteClass: {
        type: Sequelize.STRING
      },
      ballotID: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Votes');
  }
};
