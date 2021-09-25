import cors from 'cors';
import express, { Express } from 'express';
import * as bodyParser from 'body-parser';
import mockHandler from './handlers/';
import morgan from 'morgan';
import { Mock, Engine } from '../engine';
import { WebSocketServer } from 'ws';

import https from 'https';
import http from 'http';
import { loadMocks } from './utils';
import { isTLSEnabled, loadSSLCerts } from './ssl';

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

const createExpress = ({ config, engine }: { config: DeputyConfig; engine: Engine }): Express => {
    const app = express();
    app.use(bodyParser.text({ type: 'application/x-yaml' }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use('/_/dashboard', express.static(`dashboard`));

    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan('common'));
    }

    app.use(mockHandler({ config, engine }));
    return app;
};

const createWebSocket = ({ server, engine }: { server: http.Server; engine: Engine }) => {
    const wss = new WebSocketServer({ server });
    engine.on('change', (state) => wss.clients.forEach((client) => client.send(JSON.stringify(state))));
    wss.on('connection', (ws) => ws.send(JSON.stringify(engine.state)));
};

type App = {
    app: Express;
    server: http.Server;
    start: () => void;
    stop: () => void;
};

export const createServer = async (argConfig: DeputyConfig): Promise<App> => {
    const config = Object.assign({}, defaultConfig, argConfig);
    const mocks = loadMocks(config);
    const engine = new Engine(mocks, { autoForwardRequest: argConfig.proxy });
    const app = createExpress({ config, engine });

    let server = http.createServer(app);
    if (isTLSEnabled()) {
        const { cert, key } = loadSSLCerts();
        server = https.createServer({ key, cert }, app);
    }

    return {
        app,
        server,
        start: async () => {
            createWebSocket({ server, engine });
            server.listen(config.port);
        },
        stop: () => {
            server.close();
        },
    };
};
