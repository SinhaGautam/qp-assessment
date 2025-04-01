import { DataSource } from 'typeorm';
import { logger } from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();
const E = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: E.DB_HOST,
  port: E.DB_PORT ? parseInt(E.DB_PORT) : 5432,
  username: E.DB_USERNAME,
  password: E.DB_PASSWORD,
  database: E.DB_NAME,
  schema: E.DB_SCHEMA,
  entities: ['src/entities/*.ts'],
  synchronize: false, // Set to false in production, use migrations instead
  logging: false,
});

export const connectDB = async () => {
  try {
    logger.info('Connecting to PostgreSQL...');
    await AppDataSource.initialize();
    logger.info("PostgreSQL connected successfully");
  } catch (error) {
    logger.error(`Error connecting to PostgreSQL: ${error}`);
    process.exit(1);
  }
};
