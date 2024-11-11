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
    }, {
        sequelize,
        modelName: 'Appointment',
        tableName: 'Appointment',
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    });
    return Appointment;
};