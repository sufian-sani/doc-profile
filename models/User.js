// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
//
// class User extends Model {}
//
// User.init({
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true, // Ensure email is unique
//         validate: {
//             isEmail: true, // Validate that it's a valid email format
//         },
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
// }, {
//     sequelize,
//     modelName: 'User',
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
// });
//
// module.exports = User;
// ---------------
'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Profiles, Schedule, Appointment}) {
            // define association here
            this.hasOne(Profiles, { foreignKey: 'userId', as: 'profile'})
            this.hasMany(Schedule, { foreignKey: 'doctorId', as: 'schedules' });
            this.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
                // this.belongsTo(Users, { foreignKey: 'userId', as: 'users' })
            // this.belongsTo(Blogs, { foreignKey: 'blogId', as: 'blogs' })
        }
    }
    Users.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensure email is unique
            validate: {
                isEmail: true, // Validate that it's a valid email format
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('stuff','doctor', 'patient'), // Add role column
            defaultValue: 'patient', // Default to patient
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Users',
        tableName: 'Users',
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    });
    return Users;
};