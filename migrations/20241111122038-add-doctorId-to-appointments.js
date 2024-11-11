'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Appointment', 'doctorId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Assuming the doctors are stored in the Users table
        key: 'id',
      },
      onDelete: 'CASCADE', // Optional: defines the action on deletion of a user
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Appointment', 'doctorId');
  }
};
