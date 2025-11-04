// backend/models/Patient.js

module.exports = (sequelize, DataTypes) => {
    const Patient = sequelize.define('Patient', {
        PatientID: {
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
        Address: { // Key Attribute 
            type: DataTypes.STRING,
        },
        MedicalHistory: { // Key Attribute 
            type: DataTypes.TEXT, // Store a summary or reference
        }
    }, {
        tableName: 'Patient',
        timestamps: false,
    });

    return Patient;
};