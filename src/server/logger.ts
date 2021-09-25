import { createLogger, format, transports } from 'winston';

export default createLogger({
    silent: process.env.NODE_ENV === 'test',
    level: process.env.NODE_LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.colorize(),
        format.errors({ stack: true }),
        format.logstash(),
    ),
    defaultMeta: { service: 'mock-server' },
    transports: [new transports.Console({ format: format.json() })],
});
