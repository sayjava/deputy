import { Engine } from '../../engine';
import { IncomingMessage, ServerResponse } from 'http';
import createAssertHandler from '../handlers/assert';
import createMocksHandler from './mocks';
import createRecordsHandler from '../handlers/records';
import createRoutesHandler from '../handlers/routes';
import createSequenceHandler from '../handlers/sequence';
import { DeputyConfig, sendJson } from '../utils';
import Yaml from 'yaml';

export interface MockHttpProps {
    config: DeputyConfig;
    engine: Engine;
}

export default ({ engine }: MockHttpProps) => {
    const recordsHandler = createRecordsHandler(engine);
    const mockHandler = createMocksHandler(engine);
    const routesHandler = createRoutesHandler(engine);
    const assertHandler = createAssertHandler(engine);
    const sequenceHandler = createSequenceHandler(engine);

    return (req: IncomingMessage, res: ServerResponse) => {
        switch (req.url) {
            case '/_/api/mocks':
                return mockHandler(req, res);

            case '/_/api/records':
                return recordsHandler(req, res);

            case '/_/api/requests/assert':
                return assertHandler(req, res);

            case '/_/api/requests/sequence':
                return sequenceHandler(req, res);

            case '/_/api/reset':
                switch (req.method) {
                    case 'POST':
                        engine.clearAll();
                        return sendJson({ res, status: 201, body: { ok: true } });
                    default:
                        return sendJson({ res, status: 401, body: { message: `${req.method} Not supported` } });
                }

            case '/_/api/clear':
                switch (req.method) {
                    case 'POST':
                        engine.clearAllRecords();
                        return sendJson({ res, status: 201, body: { ok: true } });
                    default:
                        return sendJson({ res, status: 401, body: { message: `${req.method} Not supported` } });
                }

            case '/_/api/reorder-mocks':
                try {
                    switch (req.method) {
                        case 'POST':
                            // @ts-ignore:  req.body
                            const { ids } = Yaml.parse(req.body);
                            if (Array.isArray(ids)) {
                                engine.reorderMocks(ids);
                                return sendJson({ res, status: 201, body: { ok: true } });
                            } else {
                                sendJson({ res, status: 401, body: { message: `Mock ids must be an array` } });
                            }
                        default:
                            return sendJson({ res, status: 401, body: { message: `${req.method} Not supported` } });
                    }
                } catch (error) {
                    console.error();
                }

            case '/_/api/engine':
                switch (req.method) {
                    case 'GET':
                        return sendJson({
                            res,
                            status: 200,
                            body: { records: engine.records, mock: engine.mocks },
                        });
                    default:
                        return sendJson({ res, status: 401, body: { message: `${req.method} Not supported` } });
                }

            default:
                return routesHandler(req, res);
        }
    };
};
