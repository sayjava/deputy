import { Request } from '../../types';
import mapMatcher from './map';

export default (expRequest: Request, req: Request): boolean => {
    return mapMatcher(expRequest.headers || {}, req.headers || {});
};
