// backend/models/Prescription.js

module.exports = (sequelize, DataTypes) => {
    const Prescription = sequelize.define('Prescription', {
        PrescriptionID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Medication: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Dosage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Frequency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Duration: {
            type: DataTypes.STRING,
            allowNull: false,
        }
        // Foreign Keys for PatientID, DoctorID, and AppointmentID are handled by associations
    }, {
        tableName: 'Prescription',
        timestamps: false,
    });

    return Prescription;
};