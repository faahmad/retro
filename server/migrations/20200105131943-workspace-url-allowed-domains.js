"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn("workspaces", "url", {
      type: Sequelize.STRING,
      unique: true
    });
    return queryInterface.addColumn("workspaces", "allowedEmailDomains", {
      type: Sequelize.ARRAY(Sequelize.STRING)
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
