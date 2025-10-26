// backend/models/index.js

const { sequelize } = require('../config/db.config'); // Assumes you completed db.config.js
const { DataTypes } = require('sequelize');

// 1. Initialize DB object and import all models
const db = {};
db.sequelize = sequelize;
db.DataTypes = DataTypes;

// Load Models
db.Doctor = require('./Doctor')(sequelize, DataTypes);
db.Patient = require('./Patient')(sequelize, DataTypes);
db.Nurse = require('./Nurse')(sequelize, DataTypes);
db.Appointment = require('./Appointment')(sequelize, DataTypes);
db.Prescription = require('./Prescription')(sequelize, DataTypes);
db.LabResult = require('./LabResult')(sequelize, DataTypes);
db.Bill = require('./Bill')(sequelize, DataTypes);
db.MedicalHistory = require('./MedicalHistory')(sequelize, DataTypes);

// 2. Define Relationships (Cardinality Mapping)

// --- Primary Entities to Appointment (1:N) ---
// Doctor schedules multiple appointments [cite: 150]
db.Doctor.hasMany(db.Appointment, { foreignKey: 'DoctorID', as: 'Appointments' });
db.Appointment.belongsTo(db.Doctor, { foreignKey: 'DoctorID' });

// Patient books multiple appointments [cite: 151]
db.Patient.hasMany(db.Appointment, { foreignKey: 'PatientID', as: 'Appointments' });
db.Appointment.belongsTo(db.Patient, { foreignKey: 'PatientID' });

// Nurse assists multiple appointments [cite: 152]
db.Nurse.hasMany(db.Appointment, { foreignKey: 'NurseID', as: 'AssistedAppointments' });
db.Appointment.belongsTo(db.Nurse, { foreignKey: 'NurseID' });


// --- Doctor/Patient to Prescriptions (1:N) ---
// Doctor prescribes medications [cite: 155]
db.Doctor.hasMany(db.Prescription, { foreignKey: 'DoctorID', as: 'PrescriptionsWritten' });
db.Prescription.belongsTo(db.Doctor, { foreignKey: 'DoctorID' });

// Patient receives prescriptions [cite: 156]
db.Patient.hasMany(db.Prescription, { foreignKey: 'PatientID', as: 'PrescriptionsReceived' });
db.Prescription.belongsTo(db.Patient, { foreignKey: 'PatientID' });


// --- Transactional Relationships ---
// Appointment generates prescriptions (1:N) [cite: 152]
db.Appointment.hasMany(db.Prescription, { foreignKey: 'AppointmentID', as: 'GeneratedPrescriptions' });
db.Prescription.belongsTo(db.Appointment, { foreignKey: 'AppointmentID' });

// Appointment produces lab results (1:N) [cite: 154]
db.Appointment.hasMany(db.LabResult, { foreignKey: 'AppointmentID', as: 'ProducedLabResults' });
db.LabResult.belongsTo(db.Appointment, { foreignKey: 'AppointmentID' });

// Appointment is BilledBy one bill (1:1) [cite: 153]
db.Appointment.hasOne(db.Bill, { foreignKey: 'AppointmentID', as: 'Bill' });
db.Bill.belongsTo(db.Appointment, { foreignKey: 'AppointmentID' });


// --- Patient Data Relationships (1:N) ---
// Patient is Charged For bills (1:N) [cite: 157]
db.Patient.hasMany(db.Bill, { foreignKey: 'PatientID', as: 'Bills' });
db.Bill.belongsTo(db.Patient, { foreignKey: 'PatientID' });

// Patient hasLab Results (1:N) [cite: 158]
db.Patient.hasMany(db.LabResult, { foreignKey: 'PatientID', as: 'LabResults' });
db.LabResult.belongsTo(db.Patient, { foreignKey: 'PatientID' });

// Patient has Medical History (1:1 or 1:N depending on design. Using 1:N for multiple records)
db.Patient.hasMany(db.MedicalHistory, { foreignKey: 'PatientID', as: 'Records' });
db.MedicalHistory.belongsTo(db.Patient, { foreignKey: 'PatientID' });


// 3. Database Synchronization
db.sequelize.sync({ alter: true }) // 'alter: true' updates tables without dropping existing data (use cautiously)
    .then(() => {
        console.log("✅ Database tables synchronized successfully.");
    })
    .catch(err => {
        console.error("❌ Failed to synchronize database tables:", err);
    });

module.exports = db;