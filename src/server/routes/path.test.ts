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

describe('Paths', () => {
    beforeEach(() => {
        // @ts-ignore
        fs.readFileSync.mockReset();
    });

    it('validates that query parameters work', async () => {
        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReturnValueOnce(
            JSON.stringify([
                {
                    name: 'test expectations',
                    request: {
                        path: '/tasks',
                        method: 'GET',
                        queryParams: {
                            id: '[a-z]',
                        },
                    },
                    response: {
                        headers: {
                            'content-type': 'text/plain',
                        },
                        body: 'Query worked',
                    },
                },
            ]),
        );

        const { mockServer } = await createServer({});
        const res = await request(mockServer).get('/tasks?id=visitShopd').send();

        expect(res.status).toBe(200);
        expect(res.text).toMatchInlineSnapshot(`"Query worked"`);
    });

    it('validates that path parameters work', async () => {
        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReturnValueOnce(
            JSON.stringify([
                {
                    name: 'test expectations',
                    request: {
                        path: '/tasks/:id/doc/:docId',
                        method: 'GET',
                        pathParams: {
                            id: '[a-z]+',
                            docId: '[a-z]+',
                        },
                    },
                    response: {
                        headers: {
                            'content-type': 'text/plain',
                        },
                        body: 'Query worked',
                    },
                },
            ]),
        );

        const { mockServer } = await createServer({});
        const res = await request(mockServer).get('/tasks/apple/doc/new').send();

        expect(res.status).toBe(200);
    });

    it('validates that the middleware mounts on the route', async () => {
        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReturnValueOnce(
            JSON.stringify([
                {
                    name: 'test expectations',
                    request: {
                        path: '/tasks/:id/doc/:docId',
                        method: 'GET',
                        pathParams: {
                            id: '[a-z]+',
                            docId: '[a-z]+',
                        },
                    },
                    response: {
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: 'Query worked',
                    },
                },
            ]),
        );

        const { mockServer } = await createServer({});
        const res = await request(mockServer).get('/api/tasks/apple/doc/new').send();

        expect(res.status).toBe(200);
        expect(res.text).toMatchInlineSnapshot(`"Query worked"`);
    });

    it('validates that response headers are sent', async () => {
        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReturnValueOnce(
            JSON.stringify([
                {
                    name: 'test expectations',
                    request: {
                        path: '/tasks/:id/doc/:docId',
                        method: 'GET',
                        pathParams: {
                            id: '[a-z]+',
                            docId: '[a-z]+',
                        },
                    },
                    response: {
                        headers: {
                            'x-client-headers': 'some-headers',
                            'content-type': 'text/plain',
                        },
                        body: 'a response',
                    },
                },
            ]),
        );

        const { mockServer } = await createServer({});
        const res = await request(mockServer).get('/api/tasks/apple/doc/new').send();

        expect(res.status).toBe(200);
        expect(res.text).toMatchInlineSnapshot(`"a response"`);
        expect(res.headers).toEqual(
            expect.objectContaining({
                'content-type': 'text/plain; charset=utf-8',
                'x-client-headers': 'some-headers',
            }),
        );
    });
});
