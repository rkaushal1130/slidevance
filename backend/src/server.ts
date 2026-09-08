import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(env.port, () => {
    logger.info(`🚀 Slidevance API Server is running on http://localhost:${env.port}`);
    logger.info(`📡 Environment: ${env.nodeEnv}`);
    logger.info(`📁 Storage driver: ${env.storageDriver}`);
    logger.info(`✉️  Email provider: ${env.email.provider}`);
  });

  const handleShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
