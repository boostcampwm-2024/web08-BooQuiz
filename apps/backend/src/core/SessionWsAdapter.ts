import { WsAdapter } from '@nestjs/platform-ws';
import { RequestHandler } from 'express';
import { NestApplication } from '@nestjs/core';
import { Session } from 'express-session';

export interface WebSocketWithSession extends WebSocket {
    session: Session;
}

export class SessionWsAdapter extends WsAdapter {
    constructor(
        private readonly app: NestApplication | any,
        private readonly sessionMiddleware: RequestHandler,
    ) {
        super(app);
    }

    create(
        port: number,
        options?: Record<string, any> & {
            namespace?: string;
            server?: any;
            path?: string;
        },
    ): any {
        const httpServer = this.app.getHttpServer();
        const wsServer = super.create(port, options);

        httpServer.removeAllListeners('upgrade');

        httpServer.on('upgrade', (request, socket, head) => {
            this.sessionMiddleware(request, {} as any, () => {
                try {
                    const baseUrl = 'ws://' + request.headers.host + '/';
                    const pathname = new URL(request.url, baseUrl).pathname;
                    const wsServersCollection = this.wsServersRegistry.get(port);

                    let isRequestDelegated = false;
                    for (const wsServer of wsServersCollection) {
                        if (pathname === wsServer.path) {
                            wsServer.handleUpgrade(request, socket, head, (ws: unknown) => {
                                ws['session'] = request.session;
                                wsServer.emit('connection', ws, request);
                            });
                            isRequestDelegated = true;
                            break;
                        }
                    }
                    if (!isRequestDelegated) {
                        socket.destroy();
                    }
                } catch (err: any) {
                    socket.end('HTTP/1.1 400\r\n' + err.message);
                }
            });
        });

        return wsServer;
    }
}
