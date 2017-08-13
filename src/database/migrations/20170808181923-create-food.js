'use strict';
var db = require('../models/index');

module.exports = {
  up: function(queryInterface, Sequelize) {
    return db.sequelize.model('Food').sync({ force: true }); // development only: needs to change for production
  },
  up_create_table: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Food', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      imageUrl: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Food');
  }
};
