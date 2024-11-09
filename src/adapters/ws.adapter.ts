import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Server } from 'socket.io';
import * as sharedsession from 'express-socket.io-session'
/**
 * Enable session  using express-socket.io-session
 */
export class WsAdapter extends IoAdapter {
    private app: NestExpressApplication;
    private session;

    constructor(app: NestExpressApplication, session) {
        super(app)
        this.app = app;
        this.session = session;
    }

    createIOServer(port: number, options?: any): any {
        const server: Server = super.createIOServer(port, options);
        //сохранение сессии 
        server.use(sharedsession(this.session, {
            autoSave: true
        }));
        return server;
    }
}