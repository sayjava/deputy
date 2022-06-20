import request from 'supertest';
import { Server } from 'http';
import { createServer } from '..';

describe('Headers', () => {
    let server: Server;

    beforeAll(async () => {
        const { apiServer, mockServer } = await createServer({ autoProxy: false });
        const res = await request(apiServer)
            .post('/api/mocks')
            .set('content-type', 'application/json')
            .send(
                JSON.stringify([
                    {
                        request: {
                            path: '/headers_subset_keys',
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                Host: 'example.com',
                            },
                        },
                        response: {
                            status: 200,
                            body: 'headers_subset_keys',
                        },
                    },
                    {
                        request: {
                            path: '/headers_regex',
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                'x-mock-version': '[0-9]+',
                            },
                        },
                        response: {
                            status: 200,
                            body: 'headers_regex',
                        },
                    },
                    {
                        request: {
                            path: '/empty_headers',
                            method: 'GET',
                            headers: {},
                        },
                        response: {
                            status: 200,
                            body: 'empty_headers',
                        },
                    },
                ]),
            );

        server = mockServer;
    });

    it('matches subset headers', async () => {
        const res = await request(server)
            .get('/headers_subset_keys')
            .set('Accept', 'application/json')
            .set('Cache-Control', 'no-cache')
            .set('Host', 'example.com');

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchInlineSnapshot(`"headers_subset_keys"`);
    });

    it('matches subset headers', async () => {
        const res = await request(server)
            .get('/headers_regex')
            .set('Accept', 'application/json')
            .set('x-mock-version', '2');

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchInlineSnapshot(`"headers_regex"`);
    });

    it('matches subset headers', async () => {
        const res = await request(server)
            .get('/empty_headers')
            .set('Accept', 'application/json')
            .set('x-mock-version', '2');

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchInlineSnapshot(`"empty_headers"`);
    });
});
