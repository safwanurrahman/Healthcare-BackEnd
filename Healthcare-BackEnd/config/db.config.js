// backend/config/db.config.js

const { Sequelize } = require('sequelize');

// Create the Sequelize instance using environment variables
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        // Disable logging of raw SQL queries for a cleaner console
        logging: false, 
        // Database connection pooling strategy [cite: 75]
        pool: {
            max: 5, 
            min: 0, 
            acquire: 30000, 
            idle: 10000 
        }
    }
);

// Function to test the database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection has been established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        // Exit the process if the database is critical to run
        // process.exit(1); 
    }
};

module.exports = {
    sequelize,
    testConnection
};