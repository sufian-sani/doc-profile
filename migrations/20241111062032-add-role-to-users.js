// migrations/XXXXXXXXXXXXXX-add-role-to-users.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('stuff','doctor', 'patient'),
      allowNull: false,
      defaultValue: 'patient',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'role');
  }
};
