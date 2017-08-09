'use strict';
var db = require('../models/index');

module.exports = {
  up: function(queryInterface, Sequelize) {
    return db.sequelize.model('Ballot').sync({ force: true }); // development only: needs to change for production
  },
  up_create_table: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Ballots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dropoffID: {
        type: Sequelize.INTEGER
      },
      foodID: {
        type: Sequelize.INTEGER
      },
      voteCount: {
        type: Sequelize.INTEGER
      },
      wasShipped: {
        type: Sequelize.BOOLEAN
      },
      elected: {
        type: Sequelize.BOOLEAN
      },
      notShippedDesc: {
        type: Sequelize.STRING
      },
      notShippedClass: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Ballots');
  }
};
