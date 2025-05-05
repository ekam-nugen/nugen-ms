import { config } from 'dotenv';
config();

export const APP_URL = process.env.APP_URL;
export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_ACCESS_TOKEN_REFRESH_SECRET =
  process.env.JWT_ACCESS_TOKEN_REFRESH_SECRET;
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
export const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
export const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
export const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;
