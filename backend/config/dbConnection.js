// dbConnection.js
import mongoose from 'mongoose';

// =============================================================================
// ENVIRONMENT-BASED DATABASE SELECTION
// =============================================================================

const isProduction = process.env.NODE_ENV === 'production';
const environment = isProduction ? 'production' : 'development';

// Select the appropriate MongoDB URI based on environment
// Fallback to generic MONGODB_URI for backward compatibility
const uri = isProduction
  ? (process.env.MONGODB_URI_PROD || process.env.MONGODB_URI)
  : (process.env.MONGODB_URI_DEV || process.env.MONGODB_URI);

// Validate that a URI is available
if (!uri) {
  const envVar = isProduction ? 'MONGODB_URI_PROD' : 'MONGODB_URI_DEV';
  throw new Error(`❌ ${envVar} (or MONGODB_URI) is missing. Check your .env file!`);
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