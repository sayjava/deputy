import { create } from './engine';
import { Mock, Request, Verification, VerificationError } from '../types';

test('at most 1 time and at least 1 time', async () => {
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
            },
        },
        {
            id: 'exp1',
            name: 'sample1',
            request: {
                headers: {},
                path: '/todos',
                method: 'POST',
            },
            response: {
                status: 200,
            },
        },
    ];

    const engine = create({ mocks, config: {} });

    const post: Request = {
        path: '/todos',
        method: 'POST',
        headers: {},
    };

    const get: Request = {
        path: '/todos',
        method: 'GET',
        headers: {},
    };

    await engine.execute(post);
    await engine.execute(get);

    const verificationPost: Verification = {
        request: post,
        limit: { atMost: 1 },
    };
    const verifiedPost = engine.assert(verificationPost);
    expect(verifiedPost).toMatchInlineSnapshot(`true`);

    const verificationGet: Verification = {
        request: get,
        limit: { atLeast: 1 },
    };
    const verifiedGet: any = engine.assert(verificationGet);
    expect(verifiedGet).toMatchInlineSnapshot(`true`);
});

test('exactly 2 times', async () => {
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
            },
        },
    ];

    const engine = create({ mocks, config: {} });

    const request: Request = {
        path: '/todos',
        method: 'GET',
        headers: {},
    };

    await engine.execute(request);
    await engine.execute(request);
    await engine.execute(request);
    await engine.execute(request);

    const verification: Verification = {
        request,
        limit: { atMost: 2, atLeast: 2 },
    };
    const verified = engine.assert(verification) as VerificationError;

    expect(verified.message).toMatchInlineSnapshot(
        `"Expected to have received GET:/todos at most 2 times but was received 4 times"`,
    );
});

test('matches at least once', async () => {
    const mocks: Mock[] = [
        {
            id: 'exp1',
            name: 'sample1',
            request: {
                headers: {},
                path: '/todo/2',
                method: 'GET',
            },
            response: {
                status: 200,
            },
            limit: 1,
        },
    ];

    const engine = create({ mocks, config: {} });

    const request: Request = {
        path: '/todo/2',
        method: 'GET',
        headers: {},
    };

    const verification: Verification = {
        request,
    };

    await engine.execute(request);
    const verified = engine.assert(verification);

    expect(verified).toMatchInlineSnapshot(`true`);
});

test('at least 1 times with other records', async () => {
    const mocks: Mock[] = [
        {
            id: 'exp1',
            name: 'sample1',
            request: {
                path: '/todos$',
                method: 'GET',
            },
            response: {
                status: 200,
            },
            limit: 1,
        },
    ];

    const engine = create({ mocks, config: {} });

    const request: Request = {
        path: '/todos/take-trash-out',
        method: 'GET',
    };

    await engine.execute(request);
    await engine.execute(request);
    await engine.execute(request);
    await engine.execute(request);

    const verification: Verification = { request, limit: { atLeast: 1 } };
    const verified = engine.assert(verification) as VerificationError;

    expect(verified).toMatchInlineSnapshot(`true`);
});

test('at most 3 times', async () => {
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
            },
        },
    ];

    const engine = create({ mocks, config: {} });

    const request: Request = {
        path: '/todos',
        method: 'GET',
        headers: {},
    };

    await engine.execute(request);
    await engine.execute(request);
    await engine.execute(request);
    await engine.execute(request);

    const verification: Verification = { request, limit: { atMost: 3 } };
    const verified = engine.assert(verification) as VerificationError;

    expect(verified.message).toMatchInlineSnapshot(
        `"Expected to have received GET:/todos at most 3 times but was received 4 times"`,
    );
});

test('at least 3 times', async () => {
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
            },
        },
    ];

    const engine = create({ mocks, config: {} });

    const request: Request = {
        path: '/todos',
        method: 'GET',
        headers: {},
    };

    await engine.execute(request);
    await engine.execute(request);
    await engine.execute(request);
    await engine.execute(request);

    const verification: Verification = { request, limit: { atLeast: 3 } };
    const verified = engine.assert(verification);

    expect(verified).toMatchInlineSnapshot(`true`);
});

test('empty record matches', () => {
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

    const verification: Verification = {
        request,
    };

    const verified = engine.assert(verification);

    expect(verified).toMatchInlineSnapshot(`
            Object {
              "actual": 0,
              "expected": 1,
              "message": "Expected to have received GET:/todos at least 1 times but was received 0 times",
              "records": Array [],
            }
      `);
});
