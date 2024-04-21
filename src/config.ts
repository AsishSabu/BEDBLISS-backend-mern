import dotenv  from 'dotenv';
dotenv.config();

const configKeys = {
  PORT: process.env.PORT,
  MONGO_DB_URL:process.env.MONGO_URI as string
};
export default configKeys;
