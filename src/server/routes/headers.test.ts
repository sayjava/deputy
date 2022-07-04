import request from 'supertest';
import { Server } from 'http';
import { createServer } from '..';

describe('Headers', () => {
    let server: Server;

    beforeAll(async () => {
        const { apiServer, mockServer } = await createServer({ autoProxy: false });
        await request(apiServer)
            .post('/api/mocks')
            .set('content-type', 'application/json')
            .send(
                JSON.stringify([
                    {
                        request: {
                            path: '/headers_subset_keys',
                            method: 'GET',
                            headers: {
                                Accept: 'application/text',
                                Host: 'example.com',
                            },
                        },
                        response: {
                            status: 200,
                            headers: {
                                'content-type': 'text/plain',
                            },
                            body: 'headers_subset_keys',
                        },
                    },
                    {
                        request: {
                            path: '/headers_regex',
                            method: 'GET',
                            headers: {
                                Accept: 'application/text',
                                'x-mock-version': '[0-9]+',
                            },
                        },
                        response: {
                            status: 200,
                            headers: {
                                'content-type': 'text/plain',
                            },
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
                            headers: {
                                'content-type': 'text/plain',
                            },
                            body: 'empty_headers',
                        },
                    },
                    {
                        request: {
                            path: '/regex_methods',
                            method: 'PUT|POST',
                        },
                        response: {
                            status: 200,
                            headers: {
                                'content-type': 'text/plain',
                            },
                            body: 'regex_methods',
                        },
                    },
                ]),
            );

        server = mockServer;
    });

    it('matches subset headers', async () => {
        const res = await request(server)
            .get('/headers_subset_keys')
            .set('Accept', 'application/text')
            .set('Cache-Control', 'no-cache')
            .set('Host', 'example.com');

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatchInlineSnapshot(`"headers_subset_keys"`);
    });

    it('matches subset headers', async () => {
        const res = await request(server)
            .get('/headers_regex')
            .set('Accept', 'application/text')
            .set('x-mock-version', '2');

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatchInlineSnapshot(`"headers_regex"`);
    });

    it('matches subset headers', async () => {
        const res = await request(server)
            .get('/empty_headers')
            .set('Accept', 'application/text')
            .set('x-mock-version', '2');

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatchInlineSnapshot(`"empty_headers"`);
    });

    it('matches subset headers', async () => {
        const put = await request(server).put('/regex_methods').set('Accept', 'application/text');

        const post = await request(server).post('/regex_methods').set('Accept', 'application/text');

        const get = await request(server).get('/regex_methods').set('Accept', 'application/text');

        expect(put.statusCode).toBe(200);
        expect(post.statusCode).toBe(200);
        expect(get.statusCode).toBe(404);
    });
});
