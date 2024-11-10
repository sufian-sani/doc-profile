'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Doctor}) {
            // define association here
            this.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
        }
    }
    Schedule.init({
        doctorId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dayOfWeek: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Schedule',
        tableName: 'Schedule',
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    });
    return Schedule;
};