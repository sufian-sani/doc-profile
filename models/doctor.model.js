// -----------------------------------------
'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Schedule}) {
            // define association here
            this.hasOne(Schedule, { foreignKey: 'scheduleId', as: 'schedule'})
            // this.hasOne(Schedule, { foreignKey: 'userId', as: 'profile'})
            // this.belongsTo(Users, { foreignKey: 'userId', as: 'users' })
            // this.belongsTo(Blogs, { foreignKey: 'blogId', as: 'blogs' })
        }
    }
    Doctor.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        specialty: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Doctor',
        tableName: 'Doctor',
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    });
    return Doctor;
};