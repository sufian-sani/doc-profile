'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Appointment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Users, Schedule}) {
            // define association here
            this.belongsTo(Users, { foreignKey: 'patientId', as: 'patient' });
            this.belongsTo(Users, { foreignKey: 'doctorId', as: 'doctor' }); // Added doctor association
            this.belongsTo(Schedule, { foreignKey: 'scheduleId', as: 'schedule' });
            // this.belongsTo(Users, { foreignKey: 'userId', as: 'users' })
            // this.belongsTo(Blogs, { foreignKey: 'blogId', as: 'blogs' })
        }
    }
    Appointment.init({
        patientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        doctorId: {  // New field for referencing the doctor
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        scheduleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Schedule',
                key: 'id',
            },
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'booked', // Other statuses: 'completed', 'cancelled'
        },
        remarks: {  // New column
            type: DataTypes.STRING,
            allowNull: true,  // Optional field
        },
        startTime: {  // New column
            type: DataTypes.DATE,
            allowNull: false,  // Ensuring the start time is required
        },
        endTime: {  // New column
            type: DataTypes.DATE,
            allowNull: false,  // Ensuring the end time is required
        },
    }, {
        sequelize,
        modelName: 'Appointment',
        tableName: 'Appointment',
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    });
    return Appointment;
};