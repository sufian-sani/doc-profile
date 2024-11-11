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
        static associate({Users}) {
            // define association here
            this.belongsTo(Users, { foreignKey: 'doctorId', as: 'doctor' });
            // this.belongsTo(Users, { foreignKey: 'userId', as: 'users' })
            // this.belongsTo(Blogs, { foreignKey: 'blogId', as: 'blogs' })
        }
    }
    Schedule.init({
        doctorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Assuming your user table is named 'users'
                key: 'id'
            }
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: false
        },
        endTime: {
            type: DataTypes.TIME,
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