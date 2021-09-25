import { Engine, Verification } from '../../engine';
import Yaml from 'yaml';
import { IncomingMessage, ServerResponse } from 'http';
import { sendJson } from '../utils';
import logger from '../logger';

export default (engine: Engine) => async (req: IncomingMessage, res: ServerResponse) => {
    switch (req.method) {
        case 'PUT':
            try {
                // @ts-ignore
                const mock = Yaml.parse(req.body);
                const verified = mock.map((verify: Verification) => engine.assert(verify));

                const passed = verified.filter((res) => typeof res !== 'boolean');
                if (passed.length !== 0) {
                    return sendJson({ res, status: 406, body: passed });
                }

                return sendJson({ res, status: 202, body: {} });
            } catch (error) {
                logger.error(error);
                return sendJson({ res, status: 400, body: error });
            }

        default:
            return sendJson({ status: 404, res, body: { message: 'Only PUT method is supported' } });
    }
};
