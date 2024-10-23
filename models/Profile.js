// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
//
// class Profile extends Model {}
//
// Profile.init({
//     bio: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
//     location: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     },
//     userId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'Users', // Reference to the Users table
//             key: 'id',
//         },
//     },
//     profilePicture: { // Field for profile picture
//         type: DataTypes.STRING, // This will typically store the URL or path of the image
//         allowNull: true,
//     },
// }, {
//     sequelize,
//     modelName: 'Profile',
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
// });
//
// module.exports = Profile;
// -----------------------------------------
'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Profiles extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Users}) {
            // define association here
            this.belongsTo(Users, { foreignKey: 'userId', as: 'user' });
            // this.belongsTo(Users, { foreignKey: 'userId', as: 'users' })
            // this.belongsTo(Blogs, { foreignKey: 'blogId', as: 'blogs' })
        }
    }
    Profiles.init({
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // references: {
            //     model: 'Users', // Reference to the Users table
            //     key: 'id',
            // },
        },
        profilePicture: { // Field for profile picture
            type: DataTypes.STRING, // This will typically store the URL or path of the image
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Profiles',
        tableName: 'Profiles',
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    });
    return Profiles;
};