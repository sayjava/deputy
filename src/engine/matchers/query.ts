import qs from 'querystring';
import { Request } from '../../types';
import mapMatcher from './map';

export default (expected: Request, received: Request): boolean => {
    const [, urlParams] = decodeURIComponent(received.path).split('?');
    const parsedParams = qs.parse(urlParams || '');

    const receivedParams = Object.assign({}, parsedParams, received.queryParams || {});

    const expectedParams = Object.entries(expected.queryParams || {}).reduce((acc, [key, value]) => {
        return Object.assign({}, acc, { [key]: decodeURIComponent(value as string) });
    }, {});

    return mapMatcher(expectedParams, receivedParams) === true;
};
