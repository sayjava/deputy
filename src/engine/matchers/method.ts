import { Request } from '../../types';
import stringMatcher from './string';

export default (expRequest: Request, req: Request): boolean => {
    return stringMatcher(req.method, expRequest.method || 'GET');
};
