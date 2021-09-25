import { create, Engine } from './engine';
import { Mock, Request } from '../types';

test('validates expectation', () => {
    const exps: any[] = [
        {
            name: 'sample',
            request: {},
            response: {},
        },
    ];

    const doCreate = () => create({ mocks: exps, config: {} });

    expect(doCreate).toThrowError();
});

test('match simple method request', () => {
    const mocks: Mock[] = [
        {
            id: 'exp1',
            name: 'sample1',
            request: {
                headers: {},
                path: '/todos',
            },
            response: {
                body: [{ id: 2, text: 'get request' }],
            },
        },
        {
            name: 'sample2',
            request: {
                method: 'DELETE',
                headers: {},
                path: '/todos',
            },
            response: {
                body: [],
            },
        },
    ];

    const engine = create({ mocks, config: {} });

    const matched = engine.match({
        path: '/todos',
        method: 'GET',
        headers: { host: 'example.com' },
    });

    expect(matched).toMatchInlineSnapshot(`
            Array [
              Object {
                "id": "exp1",
                "limit": "unlimited",
                "name": "sample1",
                "request": Object {
                  "headers": Object {},
                  "path": "/todos",
                },
                "response": Object {
                  "body": Array [
                    Object {
                      "id": 2,
                      "text": "get request",
                    },
                  ],
                },
              },
            ]
      `);
});

test('match regex method request', () => {
    const mocks: Mock[] = [
        {
            id: 'get or post',
            name: 'sample1',
            request: {
                headers: {},
                method: 'GET|POST',
                path: '/todos',
            },
            response: {
                body: [{ id: 2, text: 'get request' }],
            },
        },
        {
            id: 'match_any',
            name: 'sample2',
            request: {
                method: '.*',
                headers: {},
                path: '/todos',
            },
            response: {
                body: [],
            },
        },
    ];

    const engine = create({ mocks, config: {} });

    const matchedGet = engine.match({
        path: '/todos',
        method: 'GET',
        headers: { host: 'example.com' },
    });

    const matchedPost = engine.match({
        path: '/todos',
        method: 'POST',
        headers: { host: 'example.com' },
    });

    const matchedOthers = engine.match({
        path: '/todos',
        method: 'PUT',
        headers: { host: 'example.com' },
    });

    expect(matchedGet[0]).toMatchInlineSnapshot(`
        Object {
          "id": "get or post",
          "limit": "unlimited",
          "name": "sample1",
          "request": Object {
            "headers": Object {},
            "method": "GET|POST",
            "path": "/todos",
          },
          "response": Object {
            "body": Array [
              Object {
                "id": 2,
                "text": "get request",
              },
            ],
          },
        }
    `);

    expect(matchedPost[0]).toMatchInlineSnapshot(`
        Object {
          "id": "get or post",
          "limit": "unlimited",
          "name": "sample1",
          "request": Object {
            "headers": Object {},
            "method": "GET|POST",
            "path": "/todos",
          },
          "response": Object {
            "body": Array [
              Object {
                "id": 2,
                "text": "get request",
              },
            ],
          },
        }
    `);

    expect(matchedOthers).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "match_any",
            "limit": "unlimited",
            "name": "sample2",
            "request": Object {
              "headers": Object {},
              "method": ".*",
              "path": "/todos",
            },
            "response": Object {
              "body": Array [],
            },
          },
        ]
    `);
});

test('match headers request', () => {
    const mocks: Mock[] = [
        {
            id: 'exp1',
            name: 'sample1',
            request: {
                headers: {
                    host: 'example.com',
                },
                path: '/todos',
                method: 'GET',
            },
            response: {
                body: [{ id: 2, text: 'get request' }],
            },
        },
        {
            id: 'exp2',
            name: 'sample2',
            request: {
                method: 'DELETE',
                headers: {},
                path: '/todos',
            },
            response: {
                body: [],
            },
        },
    ];

    const engine = create({ mocks, config: {} });

    const matched = engine.match({
        path: '/todos',
        method: 'GET',
        headers: { host: 'example.com', 'User-Agent': 'node-js' },
    });

    expect(matched).toMatchInlineSnapshot(`
            Array [
              Object {
                "id": "exp1",
                "limit": "unlimited",
                "name": "sample1",
                "request": Object {
                  "headers": Object {
                    "host": "example.com",
                  },
                  "method": "GET",
                  "path": "/todos",
                },
                "response": Object {
                  "body": Array [
                    Object {
                      "id": 2,
                      "text": "get request",
                    },
                  ],
                },
              },
            ]
      `);
});

test('match json body request', () => {
    const mocks: Mock[] = [
        {
            id: 'exp1',
            name: 'sample1',
            request: {
                headers: {},
                path: '/todos',
                method: 'GET',
            },
            response: {
                body: [{ id: 2, text: 'get request' }],
            },
        },
        {
            id: 'exp2',
            name: 'sample2',
            request: {
                method: 'POST',
                headers: {},
                path: '/todos',
                body: {
                    id: 3,
                    text: 'new post',
                },
            },
            response: {
                body: [],
            },
        },
    ];

    const engine = create({ mocks, config: {} });

    const matched = engine.match({
        path: '/todos',
        method: 'POST',
        headers: { host: 'example.com' },
        body: { id: 3, text: 'new post' },
    });

    expect(matched).toMatchInlineSnapshot(`
            Array [
              Object {
                "id": "exp2",
                "limit": "unlimited",
                "name": "sample2",
                "request": Object {
                  "body": Object {
                    "id": 3,
                    "text": "new post",
                  },
                  "headers": Object {},
                  "method": "POST",
                  "path": "/todos",
                },
                "response": Object {
                  "body": Array [],
                },
              },
            ]
      `);
});

test('match string body request', () => {
    const mocks: Mock[] = [
        {
            id: 'exp1',
            name: 'sample1',
            request: {
                headers: {},
                path: '/todos',
                method: 'GET',
            },
            response: {
                body: [{ id: 2, text: 'get request' }],
            },
        },
        {
            id: 'exp2',
            name: 'sample2',
            request: {
                method: 'POST',
                headers: {},
                path: '/todos',
                body: '[0-9]th todo',
            },
            response: {
                body: [],
            },
        },
    ];

    const engine = create({ mocks, config: {} });

    const matched = engine.match({
        path: '/todos',
        method: 'POST',
        headers: { host: 'example.com' },
        body: '5th todo',
    });

    expect(matched).toMatchInlineSnapshot(`
            Array [
              Object {
                "id": "exp2",
                "limit": "unlimited",
                "name": "sample2",
                "request": Object {
                  "body": "[0-9]th todo",
                  "headers": Object {},
                  "method": "POST",
                  "path": "/todos",
                },
                "response": Object {
                  "body": Array [],
                },
              },
            ]
      `);
});

test('Mock: add results in error', () => {
    const engine = new Engine([], {});
    const add = () => engine.addMock({ request: {} } as any);
    expect(add).toThrowError('Request requires a path');
});

test('Mock: add', () => {
    const engine = new Engine([], {});
    const add = () =>
        engine.addMock({
            id: 'new',
            name: 'base expectation',
            request: { path: '/hello' },
            response: {},
        });
    expect(add).not.toThrow();
    expect(engine.mocks).toMatchInlineSnapshot(`
            Array [
              Object {
                "id": "new",
                "limit": "unlimited",
                "name": "base expectation",
                "request": Object {
                  "path": "/hello",
                },
                "response": Object {},
              },
            ]
      `);
});

test('Mock: remove', () => {
    const engine = new Engine([], {});
    engine.addMock({
        id: 'new',
        name: 'base expectation',
        request: { path: '/hello' },
        response: {},
    });
    engine.removeMock('new');
    expect(engine.mocks).toMatchInlineSnapshot(`Array []`);
});

test(`Clear all records`, () => {
    const mocks: Mock[] = [
        {
            id: 'exp1',
            name: 'sample1',
            request: {
                headers: {},
                path: '/todos',
                method: 'GET',
            },
            response: {
                body: [{ id: 2, text: 'get request' }],
            },
            limit: 2,
        },
    ];

    const request: Request = {
        path: '/todos',
        method: 'GET',
        headers: {},
    };

    const engine = create({ mocks, config: {} });

    engine.match(request);
    engine.match(request);
    engine.clearAll();

    expect(engine.records).toMatchInlineSnapshot(`Array []`);
    expect(engine.mocks).toMatchInlineSnapshot(`Array []`);
});
