import { Engine, Request as EngineRequest } from '../../engine';
import { IncomingMessage, ServerResponse } from 'http';
import logger from '../logger';
import { sendJson } from '../utils';

export default (engine: Engine) => async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const engineRequest: EngineRequest = {
            path: req.url,
            method: req.method as any,
            // @ts-ignore: req.protocol is present but the type is not installed
            protocol: req.protocol,
            headers: {
                ...req.headers,
                httpVersion: req.httpVersion,
                remoteAddress: req.socket.remoteAddress,
            } as any,
            // @ts-ignore: Just body
            body: req.body,
            time: Date.now(),
        };

        const record = await engine.execute(engineRequest);
        Object.entries(record.response.headers || {}).forEach(([key, value]) => {
            res.setHeader(key, value);
        });

        return sendJson({ status: record.response.statusCode || 200, res, body: record.response.body || '' });
    } catch (error) {
        logger.error(error);
        return sendJson({ res, status: 500, body: { error } });
    }
};
