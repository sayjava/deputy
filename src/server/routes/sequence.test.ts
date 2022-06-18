import fs from 'fs';
import { createServer } from '..';
import request from 'supertest';

jest.mock('fs', () => {
    return {
        existsSync: jest.fn(() => true),
        readFileSync: jest.fn(),
        readdirSync: () => ['mocks.json'],
        statSync: () => ({ isDirectory: () => true }),
    };
});

describe('Request Sequence', () => {
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
                {
                    name: 'test expectations',
                    request: {
                        path: '/tasks',
                        method: 'POST',
                    },
                    response: {
                        body: 'Query worked',
                    },
                },
            ]),
        );
    });

    it('return a 406  for requests less than 2', async () => {
        const { apiServer } = await createServer({});
        const res = await request(apiServer)
            .put('/api/requests/sequence')
            .set('content-type', 'application/json')
            .send(JSON.stringify([]));

        expect(res.status).toBe(406);
        expect(res.body).toMatchInlineSnapshot(`
            Object {
              "actual": "Received 0 requests",
              "expected": "At least 2 requests",
              "message": "At least 2 requests is needed for verifying a sequence",
              "records": Array [],
            }
        `);
    });

    it('return the error from a failed verification', async () => {
        const { apiServer } = await createServer({});

        const res = await request(apiServer)
            .put('/api/requests/sequence')
            .set('content-type', 'application/json')
            .send(
                JSON.stringify([
                    {
                        path: '/tasks',
                        method: 'POST',
                    },
                    {
                        path: '/tasks',
                        method: 'GET',
                    },
                ]),
            );

        expect(res.status).toBe(406);
        expect(res.body).toMatchInlineSnapshot(`
            Object {
              "actual": Array [],
              "expected": Array [
                "POST:/tasks",
                "GET:/tasks",
              ],
              "message": "Requests matched are not matched",
              "records": Array [],
            }
      `);
    });

    it('return accepted http 202', async () => {
        const { apiServer, mockServer } = await createServer({});

        await request(mockServer).post('/tasks');
        await request(mockServer).get('/tasks');

        const res = await request(apiServer)
            .put('/api/requests/sequence')
            .set('content-type', 'application/json')
            .send(
                JSON.stringify([
                    {
                        path: '/tasks',
                        method: 'POST',
                    },
                    {
                        path: '/tasks',
                        method: 'GET',
                    },
                ]),
            );

        expect(res.status).toBe(202);
    });

    it('return error for unmatched sequence', async () => {
        const { mockServer, apiServer } = await createServer({});
        await request(mockServer).get('/tasks');
        await request(mockServer).get('/tasks');

        const res = await request(apiServer)
            .put('/api/requests/sequence')
            .set('content-type', 'application/json')
            .send(
                JSON.stringify([
                    {
                        path: '/tasks',
                        method: 'POST',
                    },
                    {
                        path: '/tasks',
                        method: 'GET',
                    },
                ]),
            );

        expect(res.status).toBe(406);
    });
});
