import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig: WinstonModuleOptions = {
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.colorize(),
                winston.format.printf(({ level, message, timestamp, context }) => {
                    return `[${timestamp}] [${level}] ${context ? `[${context}] ` : ''}${message}`;
                }),
            ),
        }),
        new winston.transports.File({
            filename: 'logs/app.log',
            format: winston.format.json(),
        }),
    ],
};
