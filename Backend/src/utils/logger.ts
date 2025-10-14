import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for different log levels
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Define format for logs
const format = winston.format.combine(
  // Add timestamp
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Add colors for console output
  winston.format.colorize({ all: true }),
  // Define the format of the message
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define transports
const transports = [
  // Write all logs with importance level of `error` or less to `error.log`
  new DailyRotateFile({
    filename: path.join(__dirname, '../logs', 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d',
  }),
  // Write all logs with importance level of `info` or less to `combined.log`
  new DailyRotateFile({
    filename: path.join(__dirname, '../logs', 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
  }),
];

// Define log levels with environment-specific defaults
const getLogLevel = () => {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return process.env.LOG_LEVEL || 'warn';
    case 'test':
      return 'error'; // Minimal logging in tests
    default:
      return process.env.LOG_LEVEL || 'debug'; // Verbose in development
  }
};

// Create the logger instance
const logger = winston.createLogger({
  level: getLogLevel(),
  levels,
  format,
  transports,
});

// If we're not in production, log to the console with colors
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }));
}

export default logger;
