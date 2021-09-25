import { Engine } from '../../engine';
import { sendJson } from '..//utils';
import { IncomingMessage, ServerResponse } from 'http';

export default (engine: Engine) => async (req: IncomingMessage, res: ServerResponse) => {
    switch (req.method) {
        case 'GET':
            return sendJson({ status: 200, res, body: engine.records });

        default:
            return sendJson({ status: 401, res, body: 'Not supported' });
    }
};
