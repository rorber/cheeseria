import winston from 'winston';

const transports: winston.transport[] = [new winston.transports.Console({ level: 'debug' })];

const serializeErrors = winston.format((metadata) => {
  for (const key in metadata) {
    if (metadata[key] instanceof Error) {
      metadata[key] = {
        message: metadata[key].message,
        stack: metadata[key].stack,
      };
    }
  }
  return metadata;
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    serializeErrors(),
    winston.format.json({ maximumDepth: 5 }),
  ),
  transports,
});
