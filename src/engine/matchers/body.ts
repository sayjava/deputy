import { Request } from '../../types';
import mapMatcher from './map';
import stringMatcher from './string';

export default (expRequest: Request, req: Request): boolean => {
    if (!expRequest.body) {
        return true;
    }

    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('json')) {
        return mapMatcher(expRequest.body as { [key: string]: any }, req.body as { [key: string]: any });
    }

    return stringMatcher(String(req.body), String(expRequest.body));
};
