import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URI = process.env.DATABASE_URI || '';

export const sequelize = new Sequelize(DATABASE_URI, {
  dialect: 'postgres',
  logging: false,
});

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}
