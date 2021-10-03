import { Engine } from '../../engine';
import { IncomingMessage, ServerResponse } from 'http';
import { sendJson } from '../utils';
import Yaml from 'yaml';

export default (engine: Engine) => async (req: IncomingMessage, res: ServerResponse) => {
    try {
        // @ts-ignore:  req.body
        const isString = typeof req.body === 'string';

        // @ts-ignore:  req.body
        const body = isString ? Yaml.parse(req.body) : {};

        switch (req.method) {
            case 'GET': {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(engine.mocks));
                return res.end();
            }

            case 'POST':
                if (Array.isArray(body)) {
                    body.forEach((mock) => engine.addMock(mock));
                } else {
                    engine.addMock(body);
                }
                return sendJson({ res, status: 201, body: { message: 'ok' } });

            case 'PUT':
                if (Array.isArray(body)) {
                    body.forEach((mock) => engine.updateMock(mock));
                } else {
                    engine.updateMock(body);
                }
                return sendJson({ res, status: 201, body: { message: 'ok' } });

            case 'DELETE':
                engine.removeMock(body.id);
                return sendJson({ res, status: 201, body: { message: 'ok' } });

            default:
                return sendJson({
                    status: 401,
                    res,
                    body: { message: `${req.method} is not supported` },
                });
        }
    } catch (error) {
        return sendJson({
            res,
            status: 400,
            body: {
                message: error.message,
                actual: error.actual,
                expected: error.expected,
            },
        });
    }
};
