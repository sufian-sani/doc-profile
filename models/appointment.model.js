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
        // static associate({Users}) {
        //     // define association here
        //     this.belongsTo(Users, { foreignKey: 'userId', as: 'user' });
        // }
    }
    Appointment.init({
        doctorId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        patientName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Appointment',
        tableName: 'Appointment',
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    });
    return Appointment;
};