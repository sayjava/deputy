import axios from 'axios';
import { create } from './engine';
import { Mock, Request } from '../types';

describe('Proxy', () => {
    describe('Successfully Automatic proxying', () => {
        let record;

        beforeAll(async () => {
            const request: Request = {
                path: '/users/sayjava',
                method: 'POST',
                headers: {
                    host: 'api.github.com',
                },
                body: {
                    properties: ['id', 'url'],
                },
            };
            const mocks: Mock[] = [
                {
                    request: {
                        path: '/todos',
                    },
                    response: {
                        body: 'existing mock',
                    },
                },
            ];

            // @ts-ignore jest-ignore
            axios.mockResolvedValueOnce({
                status: 200,
                headers: { 'content-type': 'application/json' },
                data: 'proxied response',
            });

            const engine = create({ mocks, config: { autoForwardRequest: true } });
            record = await engine.execute(request);
        });

        it('calls axios', () => {
            expect(axios).toHaveBeenCalledWith({
                data: {
                    properties: ['id', 'url'],
                },
                headers: { host: 'api.github.com' },
                method: 'POST',
                params: {},
                path: '/users/sayjava',
                url: 'http://api.github.com:80/users/sayjava',
            });
        });

        it('creates a proxy request', () => {
            expect(record.proxyRequest).toMatchInlineSnapshot(`
                Object {
                  "data": Object {
                    "properties": Array [
                      "id",
                      "url",
                    ],
                  },
                  "headers": Object {
                    "host": "api.github.com",
                  },
                  "method": "POST",
                  "params": Object {},
                  "path": "/users/sayjava",
                  "url": "http://api.github.com:80/users/sayjava",
                }
            `);
        });

        it('creates a response', () => {
            expect(record.response).toMatchInlineSnapshot(`
                Object {
                  "body": "proxied response",
                  "headers": Object {
                    "content-type": "application/json",
                  },
                  "status": 200,
                }
            `);
        });
    });

    describe('Failed Automatic proxying', () => {
        let record;

        beforeAll(async () => {
            const request: Request = {
                path: '/users/sayjava',
                method: 'POST',
                headers: {
                    host: 'api.github.com',
                },
                body: {
                    properties: ['id', 'url'],
                },
            };
            const mocks: Mock[] = [
                {
                    request: {
                        path: '/todos',
                    },
                    response: {
                        body: 'existing mock',
                    },
                },
            ];

            // @ts-ignore jest-ignore
            axios.mockRejectedValueOnce({
                response: {
                    status: 503,
                    data: 'Failed Error',
                    headers: { 'content-type': 'application/json' },
                },
            });

            const engine = create({ mocks, config: { autoForwardRequest: true } });
            record = await engine.execute(request);
        });

        it('creates a response', () => {
            expect(record.response).toMatchInlineSnapshot(`
                Object {
                  "body": "Failed Error",
                  "headers": Object {
                    "content-type": "application/json",
                  },
                  "status": 503,
                }
            `);
        });
    });

    describe('Default response for failed request', () => {
        let record;

        beforeAll(async () => {
            const request: Request = {
                path: '/users/sayjava',
                method: 'POST',
                headers: {
                    host: 'api.github.com',
                },
                body: {
                    properties: ['id', 'url'],
                },
            };
            const mocks: Mock[] = [
                {
                    request: {
                        path: '/todos',
                    },
                    response: {
                        body: 'existing mock',
                    },
                },
            ];

            // @ts-ignore jest-ignore
            axios.mockRejectedValueOnce({});

            const engine = create({ mocks, config: { autoForwardRequest: true } });
            record = await engine.execute(request);
        });

        it('creates a response', () => {
            expect(record.response).toMatchInlineSnapshot(`
                Object {
                  "body": "[object Object]",
                  "headers": Object {
                    "content-type": "application/text",
                  },
                  "status": 500,
                }
            `);
        });
    });

    describe('Defined Proxy', () => {
        let record;

        beforeAll(async () => {
            // @ts-ignore jest mocking
            axios.mockReset();

            const request: Request = {
                path: '/todos',
                method: 'POST',
                body: { properties: ['id', 'url'] },
            };

            const mocks: Mock[] = [
                {
                    request: {
                        path: '/todos',
                    },
                    proxy: {
                        host: 'api.todos.com',
                        port: 9000,
                        protocol: 'https',
                        headers: {
                            'api-key': 'dev-example-key',
                        },
                    },
                },
            ];

            // @ts-ignore jest-ignore
            axios.mockResolvedValueOnce({
                status: 200,
                headers: { 'content-type': 'application/json' },
                data: 'proxied response',
            });

            const engine = create({ mocks, config: { autoForwardRequest: true } });
            record = await engine.execute(request);
        });

        it('calls axios', () => {
            expect(axios).toHaveBeenCalledWith({
                data: {
                    properties: ['id', 'url'],
                },
                headers: { 'api-key': 'dev-example-key' },
                method: 'POST',
                params: {},
                path: '/todos',
                url: 'https://api.todos.com:9000/todos',
            });
        });

        it('creates a proxy request', () => {
            expect(record.proxyRequest).toMatchInlineSnapshot(`
                Object {
                  "data": Object {
                    "properties": Array [
                      "id",
                      "url",
                    ],
                  },
                  "headers": Object {
                    "api-key": "dev-example-key",
                  },
                  "method": "POST",
                  "params": Object {},
                  "path": "/todos",
                  "url": "https://api.todos.com:9000/todos",
                }
            `);
        });
    });

    describe('Ignore localhost host names', () => {
        let record;

        beforeAll(async () => {
            // @ts-ignore jest mocking
            axios.mockReset();

            const request: Request = {
                path: '/todos',
                method: 'POST',
                body: { properties: ['id', 'url'] },
            };

            const mocks: Mock[] = [
                {
                    request: {
                        path: '/todos',
                    },
                },
            ];

            // @ts-ignore jest-ignore
            axios.mockResolvedValueOnce({
                status: 200,
                headers: { 'content-type': 'application/json' },
                data: 'proxied response',
            });

            const engine = create({ mocks, config: { autoForwardRequest: true } });
            record = await engine.execute(request);
        });

        it('does not call axios', () => {
            expect(axios).not.toHaveBeenCalled();
        });

        it('does not create a proxy request', () => {
            expect(record.proxyRequest).toMatchInlineSnapshot(`undefined`);
        });
    });

    describe('Asserts automatic proxy request', () => {
        let record;
        const engine = create({ mocks: [], config: { autoForwardRequest: true } });
        const request: Request = {
            path: '/users/sayjava',
            method: 'POST',
            headers: {
                host: 'api.github.com',
            },
        };

        beforeAll(async () => {
            // @ts-ignore jest-ignore
            axios.mockResolvedValueOnce({
                status: 200,
                headers: { 'content-type': 'application/json' },
                data: 'proxied response',
            });

            record = await engine.execute(request);
        });

        it('returns a record', () => {
            expect(record.proxyRequest).toMatchInlineSnapshot(`
                Object {
                  "data": undefined,
                  "headers": Object {
                    "host": "api.github.com",
                  },
                  "method": "POST",
                  "params": Object {},
                  "path": "/users/sayjava",
                  "url": "http://api.github.com:80/users/sayjava",
                }
            `);
        });

        it('calls axios', () => {
            expect(engine.assert({ request })).toEqual(true);
        });
    });
});
