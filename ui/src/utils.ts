import { Mock, Record } from '../../src/types';

export const convertRecordToMock = (record: Record): Mock => {
    const USELESS_HEADERS = [
        'x-forwarded-host',
        'x-forwarded-proto',
        'x-forwarded-port',
        'x-forwarded-for',
        'connection',
        'user-agent',
        'remoteAddress',
        'content-length',
        'httpVersion',
    ];

    const cleanHeaders = (headers: any) => {
        const newHeader: any = {};
        Object.entries(headers).forEach(([key, value]: [string, any]) => {
            if (!USELESS_HEADERS.includes(key)) {
                newHeader[key] = value;
            }
        });
        return newHeader;
    };

    const requestHeaders = cleanHeaders(record.request.headers || {});
    const responseHeaders = cleanHeaders(record.response.headers || {});
    const mock: Mock = {
        request: Object.assign({}, record.request, { headers: requestHeaders }),
        response: Object.assign({}, record.response, { headers: responseHeaders }),
        limit: 'unlimited',
        delay: 0,
    };

    delete mock.request.protocol;
    delete mock.request.time;
    return mock;
};
