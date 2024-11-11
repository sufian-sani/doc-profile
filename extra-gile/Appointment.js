// // models/Appointment.js
// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
//
// class Appointment extends Model {
//     static associate(models) {
//         this.belongsTo(models.DoctorSchedule, { foreignKey: 'doctorScheduleId' });
//     }
// }
//
// Appointment.init({
//     doctorScheduleId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     patientId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
// }, {
//     sequelize,
//     modelName: 'Appointment',
// });
//
// module.exports = Appointment;
