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

describe('API Mocks', () => {
    beforeEach(() => {
        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReset();

        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReturnValueOnce(
            JSON.stringify([
                {
                    id: 'test-mock',
                    name: 'test mocks',
                    request: {
                        path: '/tasks',
                        method: 'POST',
                        queryParams: {
                            id: '[a-z]',
                        },
                    },
                    response: {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                },
            ]),
        );
    });

    it('add a successful mock', async () => {
        const { apiServer } = await createServer({});
        const res = await request(apiServer)
            .post('/api/mocks')
            .set('content-type', 'application/json')
            .send([
                {
                    name: 'test mocks',
                    request: {
                        path: '/tasks',
                        method: 'POST',
                        queryParams: {
                            id: '[a-z]',
                        },
                    },
                    response: {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                },
            ]);

        expect(res.status).toBe(201);
    });

    it('add a single mock', async () => {
        const { apiServer } = await createServer({});
        const res = await request(apiServer)
            .post('/api/mocks')
            .set('content-type', 'application/json')
            .send({
                name: 'test mocks',
                request: {
                    path: 'tasks',
                    method: 'POST',
                },
            });

        expect(res.status).toBe(201);
    });

    it('fail adding a non valid mock', async () => {
        const { apiServer } = await createServer({});
        const res = await request(apiServer)
            .post('/api/mocks')
            .set('content-type', 'application/json')
            .send([
                {
                    name: 'test mocks',
                    request: {
                        method: 'POST',
                    },
                    response: null,
                },
            ]);

        expect(res.status).toBe(500);
        expect(res.body).toMatchInlineSnapshot(`
        Object {
          "message": "Request requires a path",
        }
    `);
    });

    it('remove a mock', async () => {
        const { apiServer } = await createServer({});
        const res = await request(apiServer)
            .delete('/api/mocks')
            .set('content-type', 'application/json')
            .send({ id: 'test-mock' });

        expect(res.status).toBe(201);
        expect(res.body).toMatchInlineSnapshot(`
            Object {
              "message": "ok",
            }
      `);
    });

    it('updates a mock', async () => {
        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReset();
        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReturnValueOnce(
            JSON.stringify([
                {
                    id: 'sample-mock',
                    name: 'test mocks',
                    request: {
                        path: '/tasks',
                        method: 'GET',
                    },
                    response: null,
                },
            ]),
        );
        const { apiServer } = await createServer({});

        await request(apiServer)
            .put('/api/mocks')
            .set('content-type', 'application/json')
            .send(
                JSON.stringify({
                    id: 'sample-mock',
                    request: {
                        path: '/somewhere',
                    },
                    response: {
                        status: 200,
                    },
                }),
            );

        const res = await request(apiServer).get('/api/mocks');

        expect(res.body).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "sample-mock",
            "name": "Mock",
            "request": Object {
              "path": "/somewhere",
            },
            "response": Object {
              "status": 200,
            },
          },
        ]
    `);
    });

    it('update many mocks', async () => {
        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReset();
        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReturnValueOnce(
            JSON.stringify([
                {
                    id: 'mock1',
                    name: 'test mocks',
                    request: {
                        path: '/mock1',
                        method: 'GET',
                    },
                    response: null,
                },
                {
                    id: 'mock2',
                    name: 'test mocks',
                    request: {
                        path: '/mock2',
                        method: 'GET',
                    },
                    response: null,
                },
            ]),
        );
        const { apiServer } = await createServer({});

        await request(apiServer)
            .put('/api/mocks')
            .set('content-type', 'application/json')
            .send(
                JSON.stringify([
                    {
                        id: 'mock1',
                        request: {
                            path: '/somewhere',
                        },
                        response: {
                            status: 200,
                        },
                    },
                    {
                        id: 'mock2',
                        request: {
                            path: '/another-place',
                        },
                        response: {
                            status: 200,
                        },
                    },
                ]),
            );

        const res = await request(apiServer).get('/api/mocks');

        expect(res.body).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "mock1",
            "name": "Mock",
            "request": Object {
              "path": "/somewhere",
            },
            "response": Object {
              "status": 200,
            },
          },
          Object {
            "id": "mock2",
            "name": "Mock",
            "request": Object {
              "path": "/another-place",
            },
            "response": Object {
              "status": 200,
            },
          },
        ]
    `);
    });

    it('re-order mocks', async () => {
        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReset();

        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReturnValueOnce(
            JSON.stringify([
                {
                    id: 'mock1',
                    name: 'test mocks',
                    request: {
                        path: '/mock1',
                        method: 'GET',
                    },
                    response: null,
                },
                {
                    id: 'mock2',
                    name: 'test mocks',
                    request: {
                        path: '/mock2',
                        method: 'GET',
                    },
                    response: null,
                },
            ]),
        );
        const { apiServer } = await createServer({});

        const res = await request(apiServer)
            .post('/api/mocks/order')
            .set('content-type', 'application/json')
            .send(
                JSON.stringify({
                    ids: ['mock2', 'mock1'],
                }),
            );

        expect(res.status).toBe(201);

        const { body: mocks } = await request(apiServer).get('/api/mocks');
        expect(mocks).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "mock2",
            "limit": "unlimited",
            "name": "test mocks",
            "request": Object {
              "method": "GET",
              "path": "/mock2",
            },
            "response": null,
          },
          Object {
            "id": "mock1",
            "limit": "unlimited",
            "name": "test mocks",
            "request": Object {
              "method": "GET",
              "path": "/mock1",
            },
            "response": null,
          },
        ]
    `);
    });

    it('retrieve all mocks', async () => {
        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReset();
        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReturnValueOnce(
            JSON.stringify([
                {
                    id: 'sample-mock',
                    name: 'test mocks',
                    request: {
                        path: '/tasks',
                        method: 'GET',
                    },
                    response: null,
                },
            ]),
        );

        const { apiServer } = await createServer({});
        const res = await request(apiServer).get('/api/mocks');

        expect(res.status).toBe(200);
        expect(res.body).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "sample-mock",
            "limit": "unlimited",
            "name": "test mocks",
            "request": Object {
              "method": "GET",
              "path": "/tasks",
            },
            "response": null,
          },
        ]
    `);
    });
});
