import 'dotenv/config'; // automatically loads .env
import connect from './config/dbConnection.js';
import app from './app.js';
import { isProduction, getEnvSuffix } from './utils/env.js';
import { logError } from './utils/errorUtils.js';

const env = getEnvSuffix();
// Fall back to Railway's auto-injected PORT / a safe default host so the
// service starts without requiring PORT_PROD / HOST_PROD to be set manually
// in the Railway Variables panel.
const HOST = process.env[`HOST_${env}`] ?? '0.0.0.0';
const PORT = process.env[`PORT_${env}`] ?? process.env.PORT;

if (!PORT) {
  throw new Error(
    `Missing server port: set PORT_${env} or PORT in your environment. Check your .env file.`
  );
}

let server;

const startServer = async () => {
  try {
    await connect(); // Must succeed before accepting HTTP traffic
    server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on ${HOST}:${PORT}`);
    });
  } catch (error) {
    logError(error, { context: 'Server startup' });
    process.exit(1);
  }
};

// =============================================================================
// GRACEFUL SHUTDOWN
// =============================================================================

const SHUTDOWN_TIMEOUT = 10000; // 10 seconds

const gracefulShutdown = (signal) => {
  console.log(`\n[SHUTDOWN] ${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(() => {
      console.log('[SHUTDOWN] HTTP server closed.');
      process.exit(0);
    });

    // Force close after timeout if graceful shutdown hangs
    setTimeout(() => {
      console.error('[SHUTDOWN] Forced shutdown after timeout.');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT);
  } else {
    process.exit(0);
  }
};

// Handle termination signals (container deployments, Ctrl+C)
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// =============================================================================
// PROCESS-LEVEL ERROR HANDLERS
// =============================================================================

// Handle uncaught exceptions (synchronous errors that escape try/catch)
process.on('uncaughtException', (error) => {
  logError(error, { level: 'FATAL', event: 'uncaughtException' });

  // In production, exit and let process manager (PM2, Docker, etc.) restart
  // In development, keep running for debugging
  if (isProduction()) {
    process.exit(1);
  }
});

// Handle unhandled promise rejections (async errors without .catch())
process.on('unhandledRejection', (reason, promise) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  logError(error, { level: 'FATAL', event: 'unhandledRejection' });

  // In production, exit and let process manager restart
  // In development, keep running for debugging
  if (isProduction()) {
    process.exit(1);
  }
});

// =============================================================================
// START SERVER
// =============================================================================

startServer();
