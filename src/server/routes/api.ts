import { Router } from 'express';
import { Verification, Engine } from '../../engine';

interface Props {
    engine: Engine;
}

const createMocksRouter = ({ engine }: Props) => {
    const router = Router();

    router.get('/', (_, res, next) => {
        res.locals = { body: engine.mocks, code: 200 };
        next();
    });

    router.post('/', (req, res, next) => {
        // @ts-ignore
        const body = req.body;

        if (Array.isArray(body)) {
            body.forEach((mock) => engine.addMock(mock));
        } else {
            engine.addMock(body);
        }

        res.locals = { body: { message: 'ok' }, code: 201 };
        next();
    });

    router.put('/', (req, res, next) => {
        // @ts-ignore
        const body = req.body;

        if (Array.isArray(body)) {
            body.forEach((mock) => engine.updateMock(mock));
        } else {
            engine.updateMock(body);
        }

        res.locals = { body: { message: 'ok' }, code: 200 };
        next();
    });

    router.delete('/', (req, res, next) => {
        // @ts-ignore
        const body = req.body;
        engine.removeMock(body.id);
        res.locals = { body: { message: 'ok' }, code: 201 };
        next();
    });

    router.post('/order', (req, res, next) => {
        // @ts-ignore
        const { ids } = req.body;

        if (Array.isArray(ids)) {
            engine.reorderMocks(ids);
            res.locals = { body: { ok: true }, code: 201 };
        } else {
            res.locals = { body: { message: `Mock ids must be an array` }, code: 401 };
        }
        next();
    });

    return router;
};

const createRecordsRouter = ({ engine }: Props) => {
    const router = Router();

    router.get('/', (_, res, next) => {
        res.locals = { body: engine.records, code: 200 };
        next();
    });

    return router;
};

const createMiscRouter = ({ engine }: Props) => {
    const router = Router();

    router.post('/reset', (_, res, next) => {
        engine.clearAll();
        res.locals = { body: { ok: true }, code: 201 };
        next();
    });

    router.post('/clear', (_, res, next) => {
        engine.clearAllRecords();
        res.locals = { body: { ok: true }, code: 201 };
        next();
    });

    router.post('/engine', (_, res, next) => {
        engine.clearAllRecords();
        res.locals = {
            code: 200,
            body: {
                records: engine.records,
                mock: engine.mocks,
            },
        };
        next();
    });

    return router;
};

const createRequestRouter = ({ engine }: Props) => {
    const router = Router();

    router.put('/assert', (req, res, next) => {
        try {
            // @ts-ignore
            const verifications = req.body;
            if (!Array.isArray(verifications)) {
                return next(new Error('Request body must be an array'));
            }
            const verified = verifications.map((verify: Verification) => engine.assert(verify));
            const passed = verified.filter((res) => typeof res !== 'boolean');

            if (passed.length !== 0) {
                res.locals = { code: 406, body: passed };
            } else {
                res.locals = { code: 202, body: {} };
            }

            next();
        } catch (error) {
            res.locals = { code: 400 };
            next(error);
        }
    });

    router.put('/sequence', (req, res, next) => {
        try {
            // @ts-ignore
            const requests = req.body;
            const result = engine.assertSequence(requests);

            if (result === true) {
                res.locals = { code: 202, body: {} };
            } else {
                res.locals = { code: 406, body: result };
            }
            next();
        } catch (error) {
            res.locals = { code: 400 };
            next(error);
        }
    });

    return router;
};

export const createAPIRouter = ({ engine }: Props): Router => {
    const router = Router();

    router.use('/records', createRecordsRouter({ engine }));
    router.use('/mocks', createMocksRouter({ engine }));
    router.use('/requests', createRequestRouter({ engine }));
    router.use(createMiscRouter({ engine }));

    return router;
};
