/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mock, validateMock } from '../engine';
import cookie from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import { match } from 'path-to-regexp';
import qs from 'qs';
import Yaml from 'yaml';
import logger from './logger';
import fs from 'fs';
import { DeputyConfig } from '../types';

export const parseYamlMocks = (mock: string): Array<Mock> => {
    const strMocks: Array<any> = Yaml.parse(mock);

    if (!Array.isArray(strMocks)) {
        return [validateMock(strMocks as Mock)];
    }
    const validatedMocks = strMocks.map(validateMock);
    return validatedMocks;
};

export const parseJsonMocks = (mock: string): Array<Mock> => {
    const strMocks: Array<any> = JSON.parse(mock);

    if (!Array.isArray(strMocks)) {
        return [validateMock(strMocks as Mock)];
    }
    const validatedMocks = strMocks.map(validateMock);
    return validatedMocks;
};

export const loadMocks = (args: DeputyConfig): Array<any> => {
    const { mocksDirectory = 'mocks' } = args;

    if (!fs.existsSync(mocksDirectory)) {
        logger.warn(`${mocksDirectory} can not be found.`);
        return [];
    }

    const stats = fs.statSync(mocksDirectory);

    let mocks = [];
    if (stats.isDirectory()) {
        const files = fs.readdirSync(mocksDirectory).filter((file) => file.endsWith('.yml') || file.endsWith('.json'));
        files.forEach((file) => {
            try {
                const filePath = path.join(mocksDirectory, file);
                const fileContent = fs.readFileSync(path.resolve(filePath), 'utf-8');
                const parseMocks = file.endsWith('.yml') ? parseYamlMocks : parseJsonMocks;
                mocks = [...mocks, ...parseMocks(fileContent)];
            } catch (error) {
                console.error(error);
            }
        });
    } else {
        logger.warn(`No mock was loaded from: ${mocksDirectory}`);
        logger.warn('see the docs at https://sayjava.github.com/deputy');
    }

    return mocks;
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
