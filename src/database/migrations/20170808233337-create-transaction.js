'use strict';
var db = require('../models/index');

module.exports = {
  up: function(queryInterface, Sequelize) {
    return db.sequelize.model('Transaction').sync({ force: true }); // development only: needs to change for production
  },
  up_create_table: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userID: {
        type: Sequelize.INTEGER
      },
      ballotID: {
        type: Sequelize.INTEGER
      },
      hasVoted: {
        type: Sequelize.BOOLEAN
      },
      hasPaid: {
        type: Sequelize.BOOLEAN
      },
      dropoffID: {
        type: Sequelize.INTEGER
      },
      dormPackagesOrdered: {
        type: Sequelize.INTEGER
      },
      cookingPackagesOrdered: {
        type: Sequelize.INTEGER
      },
      totalDollarAmount: {
        type: Sequelize.DECIMAL
      },
      revenueBeforeStripe: {
        type: Sequelize.DECIMAL
      },
      revenueAfterStripe: {
        type: Sequelize.DECIMAL
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
    return queryInterface.dropTable('Transactions');
  }
};
