import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    use(req: any, res: any, next: () => void) {
        const { method, url } = req;
        const startTime = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - startTime;
            this.logger.log('info', `${method} ${url} ${res.statusCode} - ${duration}ms`, {
                context: 'HTTP',
            });
        });

        next();
    }
}
