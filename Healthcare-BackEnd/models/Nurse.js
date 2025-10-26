// backend/models/Nurse.js

module.exports = (sequelize, DataTypes) => {
    const Nurse = sequelize.define('Nurse', {
        NurseID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Phone: {
            type: DataTypes.STRING,
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // UNIQUE(Email) constraint 
        },
        DOB: {
            type: DataTypes.DATEONLY,
        },
        Department: { // Key Attribute 
            type: DataTypes.STRING,
        },
        Shift: { // Key Attribute 
            type: DataTypes.STRING,
        }
    }, {
        tableName: 'Nurse',
        timestamps: false,
    });

    return Nurse;
};