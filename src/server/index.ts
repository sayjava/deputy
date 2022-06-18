import cors from 'cors';
import express, { Express } from 'express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import { Engine } from '../engine';
import { WebSocketServer } from 'ws';

import https from 'https';
import http from 'http';
import { loadMocks } from './utils';
import { loadSSLCerts } from './ssl';
import { createAPIRouter } from './routes/api';
import { createMocksRouter } from './routes/mocks';
import { errorHandler, responseHandler, parseRequestBody } from './routes/middleware';
import { DeputyConfig, MiddlewareConfig } from '../types';
import logger from './logger';

const defaultConfig: DeputyConfig = {
    port: 8080,
    apiPort: 8081,
    proxy: true,
    mocksDirectory: 'mocks',
    tls: false,
    domains: '',
};

const createExpress = (): Express => {
    const app = express();
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
    server.use(bodyParser.json());
    server.use('/dashboard', express.static('ui/build/'));
    server.use('/api', createAPIRouter({ engine }));

    server.use(responseHandler);
    server.use(errorHandler);
    return http.createServer(server);
};

export const createMockServer = async ({ engine, config }) => {
    const server = createExpress();
    server.use(parseRequestBody);
    server.use(createMocksRouter({ engine }));
    server.use(responseHandler);
    server.use(errorHandler);

    const SERVER_TIMEOUT = 4000;
    const onTimeOut = () => logger.error('Request Timeout');

    if (config.tls) {
        const { cert, key } = await loadSSLCerts({ domains: config.tlsDomains });
        return https.createServer({ key, cert }, server).setTimeout(SERVER_TIMEOUT, onTimeOut);
    } else {
        return http.createServer(server).setTimeout(SERVER_TIMEOUT, onTimeOut);
    }
};

export const createServer = async (argConfig: DeputyConfig): Promise<App> => {
    const tlsDomains = (argConfig.domains || '').split(',');
    const config = Object.assign({}, defaultConfig, argConfig, { tlsDomains });
    const engine = createEngine(config);

    const mockServer = await createMockServer({ engine, config });
    const apiServer = createAPIServer({ engine });

    return {
        mockServer,
        apiServer,
        start: async () => {
            const port = config.port || 8080;
            const apiPort = config.apiPort || 8081;
            createWebSocket({ server: apiServer, engine });
            mockServer.listen(port, () => console.info(`Deputy Mock Server started on ${port}`));
            apiServer.listen(apiPort, () => console.info(`Deputy UI Server started on ${apiPort}`));
        },
        stop: () => {
            mockServer.close();
            apiServer.close();
        },
    };
};

export const createMiddleware = (argConfig: MiddlewareConfig) => {
    const config = Object.assign({}, defaultConfig, argConfig);
    const engine = createEngine(config);
    const apiRouter = createMocksRouter({ engine });
    apiRouter.use(responseHandler);
    apiRouter.use(errorHandler);
    return apiRouter;
};
