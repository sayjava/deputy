import { create } from '../engine';
import { Mock, Request } from '../types';

test('matched 2 times only', async () => {
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

    await engine.execute(request);
    await engine.execute(request);
    const lastMatch = await engine.execute(request);

    expect(lastMatch.response).toMatchInlineSnapshot(`
        Object {
          "body": "No response found for /todos",
          "status": 404,
        }
    `);
});

test('multiple expectation matches', async () => {
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
                status: 200,
                body: 'First mock used',
            },
            limit: 1,
        },
        {
            id: 'exp2',
            name: 'sample2',
            request: {
                headers: {},
                path: '/todos',
                method: 'GET',
            },
            response: {
                status: 500,
                body: 'Second mock used',
            },
            limit: 'unlimited',
        },
    ];

    const engine = create({ mocks, config: {} });

    const request: Request = {
        path: '/todos',
        method: 'GET',
        headers: {},
    };

    const successExp = await engine.execute(request);
    expect(successExp.response).toMatchInlineSnapshot(`
        Object {
          "body": "First mock used",
          "status": 200,
        }
    `);

    const failExp = await engine.execute(request);
    expect(failExp.response).toMatchInlineSnapshot(`
        Object {
          "body": "Second mock used",
          "status": 500,
        }
    `);
});

test('matches similar mock with different limit', async () => {
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
                status: 200,
                body: 'first mock',
            },
            limit: 1,
        },
        {
            id: 'exp2',
            name: 'sample2',
            request: {
                headers: {},
                path: '/todos',
                method: 'GET',
            },
            response: {
                status: 500,
                body: 'second mock',
            },
            limit: 1,
        },
    ];

    const engine = create({ mocks, config: {} });

    const request: Request = {
        path: '/todos',
        method: 'GET',
        headers: {},
    };

    const resp1 = await engine.execute(request);
    const resp2 = await engine.execute(request);
    const resp3 = await engine.execute(request);

    // matches both mocks
    expect(resp1.response).toMatchInlineSnapshot(`
        Object {
          "body": "first mock",
          "status": 200,
        }
    `);

    // matches only the second mock
    expect(resp2.response).toMatchInlineSnapshot(`
        Object {
          "body": "second mock",
          "status": 500,
        }
    `);

    expect(resp3.response).toMatchInlineSnapshot(`
        Object {
          "body": "No response found for /todos",
          "status": 404,
        }
    `);
});
