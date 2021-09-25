/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mock, validateMock } from '../engine';
import cookie from 'cookie';
import { existsSync, readFileSync } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import { match } from 'path-to-regexp';
import qs from 'qs';
import Yaml from 'yaml';
import logger from './logger';
export interface DeputyConfig {
    fromFile?: string;
    mock?: Array<Mock>;
    debug?: boolean;
}

export const parseMocks = (mock: string): Array<Mock> => {
    const strMocks: Array<any> = Yaml.parse(mock);

    if (!Array.isArray(strMocks)) {
        return [validateMock(strMocks as Mock)];
    }
    const validatedMocks = strMocks.map(validateMock);
    return validatedMocks;
};

export const loadMocks = (args: DeputyConfig): Array<any> => {
    const { fromFile = 'mocks.yml' } = args;

    const filePath = path.join(path.resolve(process.cwd(), fromFile));
    const fileExists = existsSync(filePath);

    if (!fileExists) {
        logger.warn('No mock was loaded');
        logger.warn('see the docs at https://sayjava.github.com/deputy');
        return [];
    }

    try {
        const fileContent = readFileSync(filePath, 'utf-8');
        return parseMocks(JSON.stringify(Yaml.parse(fileContent)));
    } catch (error) {
        console.error(error);
        return [];
    }
};

interface JSONProps {
    status: number;
    res: ServerResponse;
    body: any;
}

export const sendJson = ({ status, res, body }: JSONProps): void => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(body));
    return res.end();
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const createTemplateParams = (props: { req: IncomingMessage; body: any; path: string }) => {
    const { req, body, path } = props;
    const [requestPath, urlParams] = decodeURIComponent(req.url).split('?');
    const [configuredPath] = path.split('?');
    const queryParams = qs.parse(urlParams || '');

    const pathParams = {};
    try {
        const pathRegexp = match(configuredPath);
        const { params } = pathRegexp(requestPath) as any;
        Object.assign(pathParams, params);
    } catch (error) {
        logger.warn(error);
    }

    return {
        req: {
            headers: req.rawHeaders,
            method: req.method,
            path: requestPath,
            cookies: cookie.parse(req.headers.cookie || ''),
            body,
            queryParams,
            pathParams,
        },
    };
};
