import cors from 'cors';
import express, { Express } from 'express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import { Mock, Engine } from '../engine';
import { WebSocketServer } from 'ws';

import https from 'https';
import http from 'http';
import { loadMocks } from './utils';
import { isTLSEnabled, loadSSLCerts } from './ssl';
import { createAPIRouter } from './routes/api';
import { createMocksRouter } from './routes/mocks';
import { errorHandler, responseHandler } from './routes/middleware';

export interface DeputyConfig {
    port?: number;
    fromFile?: string;
    mocks?: Array<Mock>;
    tlsEnabled?: boolean;
    proxy?: boolean;
}

const defaultConfig: DeputyConfig = {
    port: 8080,
    proxy: true,
    fromFile: 'mocks.yml',
};

const createExpress = (): Express => {
    const app = express();
    app.use(bodyParser.text({ type: 'application/x-yaml' }));
    app.use(bodyParser.json());
    app.use(cors());
    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan('common'));
    }
    return app;
};

const createWebSocket = ({ server, engine }: { server: http.Server; engine: Engine }) => {
    const wss = new WebSocketServer({ server });
    engine.on('change', (state) => wss.clients.forEach((client) => client.send(JSON.stringify(state))));
    wss.on('connection', (ws) => ws.send(JSON.stringify(engine.state)));
};

type App = {
    mockServer: http.Server;
    apiServer: http.Server;
    start: () => void;
    stop: () => void;
};

export const createEngine = (config: DeputyConfig) => {
    const mocks = loadMocks(config);
    return new Engine(mocks, { autoForwardRequest: config.proxy });
};

export const createAPIServer = ({ engine }) => {
    const server = createExpress();
    server.use('/_/', createAPIRouter({ engine }));
    server.use('/_/dashboard', express.static('ui/build/'));

    server.use(responseHandler);
    server.use(errorHandler);
    return http.createServer(server);
};

export const createMockServer = ({ engine }) => {
    const server = createExpress();
    server.use(createMocksRouter({ engine }));
    server.use(responseHandler);
    server.use(errorHandler);

    if (isTLSEnabled()) {
        const { cert, key } = loadSSLCerts();
        return https.createServer({ key, cert }, server);
    } else {
        return http.createServer(server);
    }
};

export const createServer = async (argConfig: DeputyConfig): Promise<App> => {
    const config = Object.assign({}, defaultConfig, argConfig);
    const engine = createEngine(config);

    const mockServer = createMockServer({ engine });
    const apiServer = createAPIServer({ engine });

    return {
        mockServer,
        apiServer,
        start: async () => {
            const port = Number.parseInt(config.port.toString()) || 8080;
            createWebSocket({ server: apiServer, engine });
            mockServer.listen(port, () => console.info(`Deputy Mock Server started on ${port}`));
            apiServer.listen(port + 1, () => console.info(`Deputy UI Server started on ${port + 1}`));
        },
        stop: () => {
            mockServer.close();
            apiServer.close();
        },
    };
};
