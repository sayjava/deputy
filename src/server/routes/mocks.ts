import { Router } from 'express';
import { Engine, Request as EngineRequest } from '../../engine';

interface Props {
    engine: Engine;
}

const FILTERED_HEADERS = ['transfer-encoding', 'connection'];

export const createMocksRouter = ({ engine }: Props): Router => {
    const router = Router();

    router.use(async (req, res, next) => {
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
                if (!FILTERED_HEADERS.includes(key.toLocaleLowerCase())) {
                    res.setHeader(key, value as string);
                }
            });

            res.locals = { body: record.response.body || {}, code: record.response.status || 200 };
            next();
        } catch (error) {
            next(error);
        }
    });

    return router;
};
