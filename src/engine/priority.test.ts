import { create } from '../engine';
import { Mock, Request } from '../types';

test('priority', async () => {
    const mocks: Mock[] = [
        {
            id: 'exp1',
            name: 'sample1',
            request: {
                path: '/todos',
            },
            response: {
                body: 'No Priority set',
            },
            limit: 2,
        },
        {
            id: 'exp2',
            name: 'sample2',
            request: {
                path: '/todos',
            },
            response: {
                body: 'Mock priority -1',
            },
            limit: 2,
            priority: -1,
        },
        {
            id: 'exp2',
            name: 'sample2',
            request: {
                path: '/todos',
            },
            response: {
                body: 'Mock priority 0',
            },
            limit: 2,
            priority: 0,
        },
        {
            id: 'exp2',
            name: 'sample2',
            request: {
                path: '/todos',
            },
            response: {
                body: 'Mock priority 1',
            },
            limit: 2,
            priority: 1,
        },
    ];

    const request: Request = {
        path: '/todos',
        method: 'GET',
        headers: {},
    };

    const engine = create({ mocks, config: {} });

    await engine.execute(request);
    const lastMatch = await engine.execute(request);

    expect(lastMatch.response).toMatchInlineSnapshot(`
        Object {
          "body": "Mock priority 1",
        }
    `);
});
