import { format, transports, createLogger } from 'winston';

// Modifying the log line format for easier reading
const customFormat = format.combine(
    format.timestamp({ format: "YYYYMMDD|HH:mm:ss" }),
    format.printf((info: any) => {
        return `${info.timestamp}|${info.level.toLocaleUpperCase()}|${info.message}`;
    }),
);

const logConfiguration = {
    level: 'info',
    format: customFormat,
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        // - Write all logs with importance level of `silly` or less to console
        // CONSOLE LOGGING MUST BE REMOVED IN PRODUCTION
        new transports.Console({ format: format.simple(), level: "silly" }),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
    ],
};

export default (createLogger(logConfiguration)); 