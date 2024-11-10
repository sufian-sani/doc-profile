module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Schedule', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'doctor', // Referencing the 'doctor' table (singular)
          key: 'id',
        },
        onDelete: 'CASCADE', // If a doctor is deleted, delete their schedules too
      },
      dayOfWeek: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Default value will be current timestamp
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Default value will be current timestamp
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Schedule');
  },
};
