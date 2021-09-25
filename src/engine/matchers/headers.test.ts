import matcher from './headers';
import { Request } from '../../types';

test('matches a subset header keys', () => {
    const expRequest: Request = {
        path: '/todo/1',
        headers: {
            Accept: 'application/json',
        },
        method: 'GET',
    };

    const request: Request = {
        path: '/todo/1',
        headers: {
            Accept: 'application/json',
            'Cache-Control': 'no-cache',
            Host: 'example.com',
        },
        method: 'GET',
    };

    expect(matcher(expRequest, request)).toBe(true);
});

test('matches headers values', () => {
    const expRequest: Request = {
        path: '/todo/1',
        headers: {
            Accept: 'application/json+vnd',
            'x-mock-version': '[0-9]+',
        },
        method: 'GET',
    };

    const request: Request = {
        path: '/todo/1',
        headers: {
            Accept: 'application/json+vnd',
            HOST: 'example.com',
            'x-mock-version': '1',
        },
        method: 'GET',
    };

    expect(matcher(expRequest, request)).toBe(true);
});

test('empty headers', () => {
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
