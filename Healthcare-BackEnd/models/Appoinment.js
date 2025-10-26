// backend/models/Appointment.js

module.exports = (sequelize, DataTypes) => {
    const Appointment = sequelize.define('Appointment', {
        AppointmentID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Date: {
            type: DataTypes.DATEONLY,
            allowNull: false, // NOT NULL 
        },
        Time: {
            type: DataTypes.TIME,
            allowNull: false, // NOT NULL 
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: false, // NOT NULL 
        },
        Reason: {
            type: DataTypes.TEXT,
        },
        Type: {
            type: DataTypes.STRING,
        },
        Location: {
            type: DataTypes.STRING,
        }
        // Foreign keys (DoctorID, PatientID, NurseID) are added implicitly by Sequelize associations
    }, {
        tableName: 'Appointment',
        timestamps: false,
    });

    return Appointment;
};