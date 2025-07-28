import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

// Base logger configuration
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(isDevelopment
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'HH:MM:ss',
          },
        },
      }
    : {
        // Production: JSON format
        formatters: {
          level: (label) => ({ level: label.toUpperCase() }),
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      }),
});

// Create child loggers for different modules
export const getLogger = (module: string) => logger.child({ module });