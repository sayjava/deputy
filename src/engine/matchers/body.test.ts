import matcher from './body';
import { Request } from '../../types';

test('matches a string body', () => {
    const expRequest: Request = {
        path: '/todo/1',
        headers: {},
        body: 'A simple body counts at [0-9]+',
        method: 'POST',
    };

    const request: Request = {
        path: '/todo/1',
        headers: {},
        method: 'POST',
        body: 'A simple body counts at 10',
    };

    expect(matcher(expRequest, request)).toBe(true);
});

test('matches an empty body', () => {
    const expRequest: Request = {
        path: '/todo/1',
        headers: {},
        method: 'POST',
    };

    const request: Request = {
        path: '/todo/1',
        headers: {},
        method: 'POST',
        body: 'A simple body counts at 10',
    };

    expect(matcher(expRequest, request)).toBe(true);
});

test('matches a json object', () => {
    const expRequest: Request = {
        path: '/todo/1',
        headers: {},
        method: 'POST',
        body: {
            name: 'Doe',
        },
    };

    const request: Request = {
        path: '/todo/1',
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: {
            name: 'john doe',
        },
    };

    expect(matcher(expRequest, request)).toMatchInlineSnapshot(`false`);
});

test('matches a partial object', () => {
    const expRequest: Request = {
        path: '/todo/1',
        headers: {},
        method: 'POST',
        body: {
            name: 'Doe',
        },
    };

    const request: Request = {
        path: '/todo/1',
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: {
            name: 'Doe',
            job: 'janitor',
        },
    };

    expect(matcher(expRequest, request)).toMatchInlineSnapshot(`true`);
});

test('matches a full array', () => {
    const expRequest: Request = {
        path: '/todo/1',
        headers: {},
        method: 'POST',
        body: [
            {
                name: 'user_name',
                password: 'secure_password',
            },
        ],
    };

    const request: Request = {
        path: '/todo/1',
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: [
            {
                name: 'user_name',
                password: 'secure_password',
            },
        ],
    };

    expect(matcher(expRequest, request)).toMatchInlineSnapshot(`true`);
});

test('matches a partial object with an array', () => {
    const expRequest: Request = {
        path: '/todo/1',
        headers: {},
        method: 'POST',
        body: {
            name: 'user_name',
            occupation: 'waitress',
        },
    };

    const request: Request = {
        path: '/todo/1',
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: {
            name: 'user_name',
            occupation: ['waitress', 'cook'],
        },
    };

    expect(matcher(expRequest, request)).toMatchInlineSnapshot(`true`);
});
