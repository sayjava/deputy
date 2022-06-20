#!/usr/bin/env node
import Table from 'cli-table';
import { existsSync, watch } from 'fs';
import os from 'os';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import logger from './server/logger';
import { createServer } from './server';

const logInfo = (config) => {
    const {
        eth0 = [
            {
                family: 'IPv4',
                address: 'localhost',
            },
        ],
    } = os.networkInterfaces();

    const routes = [
        ['Dashboard', '/dashboard'],
        ['List Mocks', '/api/mocks'],
        ['List Records', '/api/records'],
        ['Assert Request Sequence', '/api/sequence'],
        ['Assert Requests Existences & Counts', '/api/requests/assert'],
        ['Reset Server', '/api/reset'],
    ];

    eth0.forEach((it) => {
        if (it.family === 'IPv4') {
            const protocol = config.tls ? 'https' : 'http';
            const table = new Table({ head: ['Description', 'Url'] });
            routes.forEach(([desc, url]) => {
                table.push([desc, `http://${it.address}:${config.apiPort}${url}`]);
            });

            console.info(`|------ Deputy Server Started on port ${protocol}://${it.address}:${config.port} -------|`);
            console.info(table.toString());
        }
    });
};

const args = yargs(hideBin(process.argv))
    .option('port', {
        type: 'number',
        alias: 'p',
        describe: 'server port',
        default: process.env.DEPUTY_PORT || 8080,
    })
    .option('api-port', {
        type: 'number',
        alias: 'ap',
        describe: 'api and ui port number',
        default: process.env.DEPUTY_API_PORT || 8081,
    })
    .option('auto-proxy', {
        type: 'boolean',
        alias: 'x',
        describe: 'Automatically proxy non matching requests',
        default: process.env.DEPUTY_AUTO_PROXY === 'true',
    })
    .option('mocks-directory', {
        type: 'string',
        alias: 'd',
        describe: 'A directory containing .yml files  definitions',
        default: process.env.DEPUTY_MOCKS_DIRECTORY || 'mocks',
    })
    .option('tls', {
        type: 'boolean',
        describe: 'Enable HTTPS, Auto generate ssl certificates',
        default: process.env.DEPUTY_TLS || false,
    })
    .option('domains', {
        type: 'string',
        alias: 'domains',
        describe: 'Specify domain to auto-generate certification for. localhost is auto included',
        default: process.env.DEPUTY_DOMAINS || '',
    }).argv;

const startServer = async () => {
    const app = await createServer({ ...(args as any) });
    app.start();
    logInfo(args);
    return app;
};

const start = async () => {
    try {
        let serverApp = await startServer();
        const mocksDirectory = path.resolve(args['mocks-directory']);
        if (existsSync(mocksDirectory)) {
            watch(mocksDirectory, async () => {
                try {
                    logger.info(`${mocksDirectory} has changed and restarting the server`);
                    serverApp.stop();
                    serverApp = await startServer();
                } catch (error) {
                    logger.error(error);
                    process.exit(-1);
                }
            });
        }
    } catch (error) {
        logger.error(error);
        process.exit(-1);
    }
};

start();
