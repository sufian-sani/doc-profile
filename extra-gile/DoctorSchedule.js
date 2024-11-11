// // models/DoctorSchedule.js
// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
//
// class DoctorSchedule extends Model {
//     static associate(models) {
//         this.belongsTo(Doctor, { foreignKey: 'doctorId' });
//         this.hasMany(Appointment, { foreignKey: 'doctorScheduleId' });
//     }
// }
//
// DoctorSchedule.init({
//     doctorId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     date: {
//         type: DataTypes.DATEONLY,
//         allowNull: false,
//     },
//     startTime: {
//         type: DataTypes.TIME,
//         allowNull: false,
//     },
//     endTime: {
//         type: DataTypes.TIME,
//         allowNull: false,
//     },
// }, {
//     sequelize,
//     modelName: 'DoctorSchedule',
// });
//
// module.exports = DoctorSchedule;
