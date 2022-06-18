import fs from 'fs';
import request from 'supertest';
import { createServer } from '..';

jest.mock('fs', () => {
    return {
        existsSync: jest.fn(() => true),
        readFileSync: jest.fn(),
        readdirSync: () => ['mocks.json'],
        statSync: () => ({ isDirectory: () => true }),
    };
});

describe('Records', () => {
    beforeEach(() => {
        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReset();

        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReturnValueOnce(
            JSON.stringify([
                {
                    name: 'test expectations',
                    request: {
                        path: '/tasks',
                        method: 'GET',
                    },
                    response: {
                        body: 'Query worked',
                    },
                },
            ]),
        );
    });

    it('retrieve records', async () => {
        const { mockServer, apiServer } = await createServer({});
        await request(mockServer).post('/tasks').send();
        await request(mockServer).get('/tasks?finished=true').send();

        const res = await request(apiServer).get('/api/records');

        expect(res.status).toBe(200);

        expect(res.body.map((rec) => ({ url: rec.request.path }))).toMatchInlineSnapshot(`
            Array [
              Object {
                "url": "/tasks",
              },
              Object {
                "url": "/tasks?finished=true",
              },
            ]
      `);
    });

    it('all records are cleared', async () => {
        const { mockServer, apiServer } = await createServer({});
        await request(mockServer).post('/tasks').send();
        await request(mockServer).get('/tasks?finished=true').send();

        await request(apiServer).post('/api/clear');
        const res = await request(apiServer).get('/api/records');

        expect(res.status).toBe(200);
        expect(res.body.map((rec) => ({ url: rec.request.path }))).toMatchInlineSnapshot(`Array []`);
    });

    it('reset server', async () => {
        const { apiServer, mockServer } = await createServer({});
        await request(mockServer).post('/tasks').send();
        await request(mockServer).get('/tasks?finished=true').send();

        await request(apiServer).post('/api/reset');
        const records = await request(apiServer).get('/api/records');
        const mocks = await request(apiServer).get('/api/mocks');

        expect(records.body.map((rec) => ({ url: rec.request.path }))).toMatchInlineSnapshot(`Array []`);
        expect(mocks.body.map((rec) => ({ url: rec.request.path }))).toMatchInlineSnapshot(`Array []`);
    });

    test('handle unsupported reset', async () => {
        const { mockServer, apiServer } = await createServer({});
        await request(mockServer).post('/tasks').send();
        await request(mockServer).get('/tasks?finished=true').send();

        const res = await request(apiServer).delete('/api/reset');
        expect(res.status).toBe(404);
    });

    test('handle unsupported method', async () => {
        const { mockServer, apiServer } = await createServer({});
        await request(mockServer).post('/tasks').send();
        await request(mockServer).get('/tasks?finished=true').send();

        const res = await request(apiServer).delete('/api/records');
        expect(res.status).toBe(404);
    });
});
