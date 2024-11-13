// migrations/[timestamp]-update-appointment-time-columns.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change columns to TIME type
    await queryInterface.changeColumn('Appointment', 'startTime', {
      type: Sequelize.TIME,
      allowNull: false,
    });
    await queryInterface.changeColumn('Appointment', 'endTime', {
      type: Sequelize.TIME,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback the changes (if needed)
    await queryInterface.changeColumn('Appointment', 'startTime', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn('Appointment', 'endTime', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  }
};
