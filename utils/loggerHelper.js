const winston = require('winston');
const path = require('path');

const logLevels = {
    error: 0,
    info: 1
};

const logColors = {
    error: 'red',
    info: 'green'
};

function createTestLogger(logDir) {
    return path.join(logDir, 'testlog.log');
}

winston.addColors(logColors);

const logger = winston.createLogger({
    levels: logLevels,
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({ level: 'info' })
    ]
});

module.exports = { logger, createTestLogger };
