import winston, { format } from 'winston';
import callsite from 'callsite';

const getCallerInfo = () => {
  const stack = callsite()[2]; // 2nd index gives the caller of the logger function
  return {
    file: stack.getFileName()?.split('/').pop() || 'unknown file',
    line: stack.getLineNumber(),
    functionName: stack.getFunctionName() || 'anonymous',
  };
};

// Custom format for log messages
const customFormat = format.printf(
  ({ level, message, timestamp, metadata }) => {
    const { file, functionName, line } = metadata.metadata;
    return `[${timestamp}] [${level.toUpperCase()}] [${file}:${line} (${functionName})] ${message}`;
  },
);

// Create logger instance
const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    customFormat,
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'logs/app.log', level: 'info' }), // Log to file
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error',
    }), // Separate error log
  ],
});

// Wrapper functions to include caller info
const log = {
  info: (message) => logger.info(message, { metadata: getCallerInfo() }),
  error: (message) => logger.error(message, { metadata: getCallerInfo() }),
  warn: (message) => logger.warn(message, { metadata: getCallerInfo() }),
  debug: (message) => logger.debug(message, { metadata: getCallerInfo() }),
};

export default log;
