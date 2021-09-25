import { Engine } from '../../engine';
import { IncomingMessage, ServerResponse } from 'http';
import Yaml from 'yaml';
import { sendJson } from '../utils';
import logger from '../logger';

export default (engine: Engine) => async (req: IncomingMessage, res: ServerResponse) => {
    switch (req.method) {
        case 'PUT':
            try {
                // @ts-ignore
                const requests = Yaml.parse(req.body);

                const result = engine.assertSequence(requests);
                if (result === true) {
                    return sendJson({ res, status: 202, body: {} });
                }

                return sendJson({ res, status: 406, body: result });
            } catch (error) {
                logger.error(error);
                return sendJson({ res, status: 400, body: error });
            }

        default:
            return sendJson({ status: 404, res, body: { message: 'Only PUT method is supported' } });
    }
};
