// backend/config/db.config.js

const { Sequelize } = require('sequelize');

// Create the Sequelize instance using environment variables
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        // FIX: Add a fallback of 'mysql' in case the environment variable fails to load.
        dialect: process.env.DB_DIALECT || 'mysql',
        
        // Disable logging of raw SQL queries for a cleaner console
        logging: false, 
        
        // Database connection pooling strategy
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
    }
};

module.exports = {
    sequelize,
    testConnection
};