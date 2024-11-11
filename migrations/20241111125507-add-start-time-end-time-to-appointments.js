'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Appointment', 'startTime', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.addColumn('Appointment', 'endTime', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Appointment', 'startTime');
    await queryInterface.removeColumn('Appointment', 'endTime');
  }
};
