// backend/models/MedicalHistory.js

module.exports = (sequelize, DataTypes) => {
    const MedicalHistory = sequelize.define('MedicalHistory', {
        RecordID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Diagnosis: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        Treatments: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        Allergies: {
            type: DataTypes.TEXT,
        },
        Procedures: {
            type: DataTypes.TEXT,
        }
        // Foreign Key for PatientID is handled by associations
    }, {
        tableName: 'MedicalHistory',
        timestamps: false,
    });

    return MedicalHistory;
};