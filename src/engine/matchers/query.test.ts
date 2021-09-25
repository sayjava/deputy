import matcher from './query';
import { Request } from '../../types';

test('matches query string parameters', () => {
    const expRequest: Request = {
        path: '/todo',
        headers: {},
        method: 'GET',
        queryParams: {
            id: '[a-z]+',
            done: 'true|false',
        },
    };

    const request1: Request = {
        path: '/todo?id=take&done=true',
        headers: {},
        method: 'GET',
    };

    const request2: Request = {
        path: '/todo?id=pain&done=false',
        headers: {},
        method: 'GET',
    };

    const request3: Request = {
        path: '/todo?id=43',
        headers: {},
        method: 'GET',
    };

    expect(matcher(expRequest, request1)).toBe(true);
    expect(matcher(expRequest, request2)).toBe(true);
    expect(matcher(expRequest, request3)).toBe(false);
});

test('matches query string order parameters', () => {
    const expRequest: Request = {
        path: '/todo',
        headers: {},
        method: 'GET',
        queryParams: {
            id: '[0-9]+',
            done: 'true|false',
        },
    };

    const request1: Request = {
        path: '/todo?id=5&done=true',
        headers: {},
        method: 'GET',
    };

    const request2: Request = {
        path: '/todo?done=false&id=2',
        headers: {},
        method: 'GET',
    };

    expect(matcher(expRequest, request1)).toBe(true);
    expect(matcher(expRequest, request2)).toBe(true);
});

test('optional query string order parameters', () => {
    const expRequest: Request = {
        path: '/todo',
        headers: {},
        method: 'GET',
    };

    const request1: Request = {
        path: '/todo?done=false&id=2',
        headers: {},
        method: 'GET',
    };

    expect(matcher(expRequest, request1)).toBe(true);
});

test('matches query string parameters and path parameters', () => {
    const expRequest: Request = {
        path: '/todo/:id/owner/:ownerId',
        headers: {},
        method: 'GET',
        pathParams: {
            id: '(12|13)',
            ownerId: '([4-8])',
        },
        queryParams: {
            done: 'true|false',
        },
    };

    const request1: Request = {
        path: '/todo/12/owner/4?done=true',
        headers: {},
        method: 'GET',
    };

    const request2: Request = {
        path: '/todo/12/owner/4',
        headers: {},
        method: 'GET',
    };

    expect(matcher(expRequest, request1)).toBe(true);
    expect(matcher(expRequest, request2)).toBe(false);
});

test('matches encoded url query', () => {
    const expRequest: Request = {
        path: '/doc',
        headers: {},
        method: 'GET',
        queryParams: {
            url: 'http://(.*).com',
        },
    };

    const request1: Request = {
        path: encodeURIComponent('/doc?url=http://yarn.com'),
        headers: {},
        method: 'GET',
    };

    expect(matcher(expRequest, request1)).toBe(true);
});

test('matches encoded url query params', () => {
    const expRequest: Request = {
        path: '/doc',
        headers: {},
        method: 'GET',
        queryParams: {
            url: encodeURIComponent('http://(.*).com'),
        },
    };

    const request1: Request = {
        path: encodeURIComponent('/doc?url=http://yarn.com'),
        headers: {},
        method: 'GET',
    };

    expect(matcher(expRequest, request1)).toBe(true);
});

test('matches purely on query params in the path', () => {
    const expRequest: Request = {
        path: '/doc?id=[0-9]+',
        headers: {},
        method: 'GET',
    };

    const request1: Request = {
        path: encodeURIComponent('/doc?id=12'),
        headers: {},
        method: 'GET',
    };

    expect(matcher(expRequest, request1)).toBe(true);
});

test('merge query and path params', () => {
    const expRequest: Request = {
        path: '/doc?id=[0-9]+',
        headers: {},
        queryParams: {
            done: 'true|false',
        },
        method: 'GET',
    };

    const request1: Request = {
        path: '/doc?id=12&done=false',
        headers: {},
        method: 'GET',
    };

    expect(matcher(expRequest, request1)).toBe(true);
});
