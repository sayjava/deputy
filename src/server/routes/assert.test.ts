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

describe('Assert Requests', () => {
    beforeEach(() => {
        // @ts-ignore
        fs.readFileSync.mockReset();

        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReturnValueOnce(
            JSON.stringify([
                {
                    name: 'test expectations',
                    request: {
                        path: '/random',
                        method: 'GET',
                    },
                    response: {
                        body: 'Query worked',
                    },
                },
            ]),
        );
    });

    it('return the error from a failed existence verification', async () => {
        const { apiServer } = await createServer({});

        const res = await request(apiServer)
            .put('/api/requests/assert')
            .set('content-type', 'application/json')
            .send(
                JSON.stringify([
                    {
                        request: {
                            path: '/tasks',
                            method: 'POST',
                        },
                    },
                    {
                        request: {
                            path: '/tasks',
                            method: 'GET',
                        },
                    },
                ]),
            );

        expect(res.status).toBe(406);
        expect(res.body).toMatchInlineSnapshot(
            `
    Array [
      Object {
        "actual": 0,
        "expected": 1,
        "message": "Expected to have received POST:/tasks at least 1 times but was received 0 times",
        "records": Array [],
      },
      Object {
        "actual": 0,
        "expected": 1,
        "message": "Expected to have received GET:/tasks at least 1 times but was received 0 times",
        "records": Array [],
      },
    ]
  `,
        );
    });

    it('JSON return accepted http 202', async () => {
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

        const { mockServer, apiServer } = await createServer({});
        await request(mockServer).post('/tasks').send();
        await request(mockServer).get('/tasks').send();

        const res = await request(apiServer).put('/api/requests/assert').set('content-type', 'application/json').send(`
        [
            {
                "request": {
                    "path": "/tasks",
                    "method": "POST"
                }
            },
            {
                "request": {
                    "path": "/tasks",
                    "method": "GET"
                }
            }
        ]          
        `);

        expect(res.status).toBe(202);
    });

    it('return error for unmatched existence', async () => {
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

        const { mockServer, apiServer } = await createServer({});
        await request(mockServer).get('/tasks').send();
        await request(mockServer).get('/tasks').send();

        const res = await request(apiServer)
            .put('/api/requests/assert')
            .set('content-type', 'application/json')
            .send(
                JSON.stringify([
                    {
                        request: {
                            path: '/tasks',
                            method: 'POST',
                        },
                        count: {
                            atMost: 0,
                        },
                    },
                    {
                        request: {
                            path: '/tasks',
                            method: 'GET',
                        },
                        count: {
                            atLeast: 1,
                        },
                    },
                ]),
            );

        expect(res.status).toBe(406);
        expect(res.body).toMatchInlineSnapshot(
            `
    Array [
      Object {
        "actual": 0,
        "expected": 1,
        "message": "Expected to have received POST:/tasks at least 1 times but was received 0 times",
        "records": Array [],
      },
    ]
  `,
        );
    });
});
