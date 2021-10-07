#!/usr/bin/env node
import Table from 'cli-table';
import { existsSync, watchFile } from 'fs';
import os from 'os';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { isTLSEnabled } from './server/ssl';
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

    console.info(`|------ Deputy Server Started on port ${config.port} -------|`);

    const routes = [
        ['Dashboard', '/_/dashboard'],
        ['List Behaviors', '/_/api/mocks'],
        ['List Records', '/_/api/records'],
        ['Assert Request Sequence', '/_/api/sequence'],
        ['Assert Requests Existences & Counts', '/_/api/requests/assert'],
        ['Reset Server', '/_/api/reset'],
    ];

    eth0.forEach((it) => {
        if (it.family === 'IPv4') {
            const table = new Table({ head: ['Description', 'Url'] });
            const protocol = isTLSEnabled() ? 'https' : 'http';

            routes.forEach(([desc, url]) => {
                table.push([desc, `http://${it.address}:${config.port}${url}`]);
            });

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
    .option('proxy', {
        type: 'boolean',
        alias: 'pr',
        describe: 'Automatically proxy non matching requests',
        default: true,
    })
    .option('from-file', {
        type: 'string',
        alias: 'f',
        describe: '.yml file containing array of mocks',
        default: process.env.MOCK_FILE || 'mocks.yaml',
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
        const mockFile = path.join(process.cwd(), args['from-file']);
        if (existsSync(mockFile)) {
            watchFile(mockFile, async () => {
                try {
                    logger.info(`${mockFile} has changed and restarting the server`);
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
