import logger from '../logger';
import Yaml from 'yaml';
import { Request, Response } from 'express';
import { parse as qsParse } from 'qs';

export const errorHandler = (err, req, res, next) => {
    logger.error(err);
    res.status(500).send({
        message: err.message,
    });
};

export const responseHandler = (req, res) => {
    if (Object.keys(res.locals).length === 0) {
        return res.status(404).json({ message: `${req.method}: ${req.url} Not Found` });
    }
    return res.status(res.locals.code || 200).json(res.locals.body || {});
};

export const parseRequestBody = async (request: Request, response: Response, next: (err?: any) => void) => {
    // Parse body as a raw string and JSON/form if applicable
    const requestContentType: string | undefined = request.header('Content-Type');
    const rawBody: Buffer[] = [];

    request.on('data', (chunk) => {
        rawBody.push(Buffer.from(chunk, 'binary'));
    });

    request.on('end', () => {
        // @ts-ignore
        request.rawBody = Buffer.concat(rawBody);
        // @ts-ignore
        request.stringBody = request.rawBody.toString('utf8');

        try {
            // @ts-ignore
            if (requestContentType && request.rawBody.length > 0) {
                if (requestContentType.includes('application/json')) {
                    // @ts-ignore
                    request.body = JSON.parse(request.stringBody);
                } else if (requestContentType.includes('application/x-www-form-urlencoded')) {
                    // @ts-ignore
                    request.body = qsParse(request.stringBody, {
                        depth: 10,
                    });
                } else if (requestContentType.includes('application/xml') || requestContentType.includes('text/xml')) {
                    // @ts-ignore
                    request.body = Yaml.parse(request.stringBody, {});
                }
            }
        } catch (error: any) {
            logger.error(error);
        }

        next();
    });
};
