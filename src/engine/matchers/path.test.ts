import matcher from './path';
import { Request } from '../../types';

test('matches a direct path /todo/1', () => {
    const expRequest: Request = {
        path: '/todo/1',
        headers: {},
        method: 'GET',
    };

    const request: Request = {
        path: '/todo/1',
        headers: {},
        method: 'GET',
    };

    expect(matcher(expRequest, request)).toBe(true);
});

test('matches a regex path: /todo/[0-9]', () => {
    const expRequest: Request = {
        path: '/todo/[0-9]',
        headers: {},
        method: 'GET',
    };

    const request: Request = {
        path: '/todo/1',
        headers: {},
        method: 'GET',
    };

    expect(matcher(expRequest, request)).toBe(true);
});

test('matches multiple path parameter', () => {
    const expRequest: Request = {
        path: '/todo/:todoId/doc/:docId',
        headers: {},
        method: 'GET',
        pathParams: {
            todoId: '(1|2)',
            docId: '(xls|ppt)',
        },
    };

    const request1: Request = {
        path: '/todo/1/doc/xls',
        headers: {},
        method: 'GET',
    };

    const request2: Request = {
        path: '/todo/2/doc/ppt',
        headers: {},
        method: 'GET',
    };

    const request3: Request = {
        path: '/todo/3/doc/xls',
        headers: {},
        method: 'GET',
    };

    expect(matcher(expRequest, request1)).toBe(true);
    expect(matcher(expRequest, request2)).toBe(true);
    expect(matcher(expRequest, request3)).toBe(false);
});

test('matches regex path parameter', () => {
    const expRequest: Request = {
        path: '/todo/:todoId',
        headers: {},
        method: 'GET',
        pathParams: {
            todoId: ['[a-z]+'],
        },
    };

    const request1: Request = {
        path: '/todo/take-out-trash',
        headers: {},
        method: 'GET',
    };

    const request2: Request = {
        path: '/todo/paint-the-room',
        headers: {},
        method: 'GET',
    };

    const request3: Request = {
        path: '/todo/43',
        headers: {},
        method: 'GET',
    };

    expect(matcher(expRequest, request1)).toBe(true);
    expect(matcher(expRequest, request2)).toBe(true);
    expect(matcher(expRequest, request3)).toBe(false);
});
