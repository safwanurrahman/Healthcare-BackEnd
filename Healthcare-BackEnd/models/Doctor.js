// backend/models/Doctor.js

module.exports = (sequelize, DataTypes) => {
    const Doctor = sequelize.define('Doctor', {
        DoctorID: {
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
        Specialization: {
            type: DataTypes.STRING,
        }
    }, {
        tableName: 'Doctor',
        timestamps: false,
    });

    return Doctor;
};