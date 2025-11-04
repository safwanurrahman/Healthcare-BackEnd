// backend/models/LabResult.js

module.exports = (sequelize, DataTypes) => {
    const LabResult = sequelize.define('LabResult', {
        TestID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        TestData: {
            type: DataTypes.TEXT, // Use TEXT for potentially large result data
            allowNull: false,
        },
        ResultDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ReferenceRanges: {
            type: DataTypes.TEXT,
        }
        // Foreign Keys for PatientID and AppointmentID are handled by associations
    }, {
        tableName: 'LabResult',
        timestamps: false,
    });

    return LabResult;
};