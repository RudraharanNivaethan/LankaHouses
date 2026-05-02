// dbConnection.js
import mongoose from 'mongoose';
import { isProduction } from '../utils/env.js';

// =============================================================================
// ENVIRONMENT-BASED DATABASE SELECTION
// =============================================================================

const isProd = isProduction();
const environment = isProd ? 'production' : 'development';

// Select the appropriate MongoDB URI based on environment
const uri = isProd
  ? process.env.MONGODB_URI_PROD
  : process.env.MONGODB_URI_DEV;

// Validate that a URI is available
if (!uri) {
  const envVar = isProd ? 'MONGODB_URI_PROD' : 'MONGODB_URI_DEV';
  throw new Error(`❌ ${envVar} is missing. Check your .env file!`);
}

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log(`✅ Connected to MongoDB [${environment}]`);
  } catch (error) {
    console.error(`❌ MongoDB connection error [${environment}]:`, error.message);
    // Rethrow in all environments — the server must not start without a DB connection.
    // In production startServer() will catch this and process.exit(1).
    // In development nodemon will show the real error instead of a 10s buffering timeout.
    throw error;
  }
};

export default connect;