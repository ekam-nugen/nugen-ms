import { config } from 'dotenv';
config();

export const APP_URL = process.env.APP_URL;
export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const MONGO_URI = process.env.MONGO_URI;
