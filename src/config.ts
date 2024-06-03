import dotenv  from 'dotenv';
dotenv.config();

const configKeys = {
  PORT: process.env.PORT,
  CLIENT_PORT: process.env.CLIENT_PORT as string,
  MONGO_DB_URL:process.env.MONGO_URI as string,
  ACCESS_SECRET:process.env.ACCESS_SECRET as string,
  REFRESH_SECRET:process.env.REFRESH_SECRET as string,
  APP_EMAIL:process.env.APP_EMAIL as string,
  APP_PASSWORD:process.env.APP_PASSWORD as string,
  ADMIN_EMAIL:process.env.ADMIN_EMAIL as string,
  ADMIN_PASSWORD:process.env.ADMIN_PASSWORD as string,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID as string,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN as string,
  TWILIO_SERVICE_SID: process.env.TWILIO_SERVICE_SID as string,
  STRIPE_SECRET_KEY:process.env.STRIPE_SECRET as string
};
export default configKeys;
