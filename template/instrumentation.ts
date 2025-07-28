export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { logger } = await import('./lib/logger');
    
    // Log unhandled errors
    process.on('unhandledRejection', (reason, promise) => {
      logger.error({ err: reason }, 'Unhandled Promise Rejection');
    });
    
    process.on('uncaughtException', (error) => {
      logger.fatal({ err: error }, 'Uncaught Exception');
      process.exit(1);
    });
  }
}