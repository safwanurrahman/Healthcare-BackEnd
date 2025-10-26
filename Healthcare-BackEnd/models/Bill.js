// backend/models/Bill.js

module.exports = (sequelize, DataTypes) => {
    const Bill = sequelize.define('Bill', {
        BillID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Amount: {
            type: DataTypes.DECIMAL(10, 2), // Use DECIMAL for monetary values
            allowNull: false,
        },
        Date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        Type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        PaymentMethod: {
            type: DataTypes.STRING,
        }
        // Foreign Keys for PatientID and AppointmentID are handled by associations
    }, {
        tableName: 'Bill',
        timestamps: false,
    });

    return Bill;
};