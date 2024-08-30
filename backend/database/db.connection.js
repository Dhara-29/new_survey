import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Properly invoke dotenv.config()
dotenv.config();

const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',dialectOptions: {
    
},
  timezone:'+00:00'
});

// Test the connection (optional but recommended)
connection.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default connection;
