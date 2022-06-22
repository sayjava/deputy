import request from 'supertest';
import { Server } from 'http';
import { createServer } from '..';

describe('Body', () => {
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
                            path: '/test_path',
                            body: 'A simple body counts at [0-9]+',
                            method: 'POST',
                        },
                        response: {
                            status: 200,
                            headers: {
                                'content-type': 'text/plain',
                            },
                            body: 'body_simple_regex_string',
                        },
                    },
                    {
                        request: {
                            path: '/test_path',
                            method: 'POST',
                            body: {
                                name: 'Doe',
                            },
                        },
                        response: {
                            headers: {
                                'content-type': 'text/plain',
                            },
                            status: 200,
                            body: 'body_json_object',
                        },
                    },
                    {
                        request: {
                            path: '/test_path',
                            method: 'POST',
                            body: {
                                name: 'Doe',
                            },
                        },
                        response: {
                            status: 200,
                            headers: {
                                'content-type': 'text/plain',
                            },
                            body: 'body_partial_json_object',
                        },
                    },
                    {
                        request: {
                            path: '/test_path',
                            method: 'POST',
                            body: [
                                {
                                    name: 'user_name',
                                    password: 'secure_password',
                                },
                            ],
                        },
                        response: {
                            status: 200,
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: ['body_full_array'],
                        },
                    },
                    {
                        request: {
                            path: '/test_path',
                            method: 'POST',
                            body: ['mango', 'cranberry'],
                        },
                        response: {
                            status: 200,
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: ['body_partial_array'],
                        },
                    },
                    {
                        request: {
                            path: '/empty_body',
                            method: 'POST',
                        },
                        response: {
                            headers: {
                                'content-type': 'text/plain',
                            },
                            status: 200,
                            body: 'body_empty',
                        },
                    },
                ]),
            );

        server = mockServer;
    });

    it('matches a regex body', async () => {
        const res = await request(server)
            .post('/test_path')
            .set('Host', 'example.com')
            .set('content-type', 'text/plain')
            .send('A simple body counts at 4');

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatchInlineSnapshot(`"body_simple_regex_string"`);
    });

    it('matches an empty body', async () => {
        const res = await request(server).post('/empty_body').set('Host', 'example.com').send();

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatchInlineSnapshot(`"body_empty"`);
    });

    it('matches a json body', async () => {
        const res = await request(server)
            .post('/test_path')
            .set('Host', 'example.com')
            .set('content-type', 'application/json')
            .send({ name: 'Doe' });

        expect(res.statusCode).toBe(200);
        expect(res.text).toMatchInlineSnapshot(`"body_json_object"`);
    });

    it('matches an array', async () => {
        const res = await request(server)
            .post('/test_path')
            .set('Host', 'example.com')
            .set('content-type', 'application/json')
            .send([{ name: 'user_name', password: 'secure_password' }]);

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchInlineSnapshot(`
            Array [
              "body_full_array",
            ]
        `);
    });

    it('matches a partial array', async () => {
        const res = await request(server)
            .post('/test_path')
            .set('Host', 'example.com')
            .set('content-type', 'application/json')
            .send(['mango', 'cranberry', 'pineapple', 'grapes']);

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchInlineSnapshot(`
            Array [
              "body_partial_array",
            ]
        `);
    });
});
