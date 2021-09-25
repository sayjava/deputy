import { Request } from '../../types';

export default (expected: Request, received: Request): boolean => {
    const [receivedBasePath] = received.path.split('?');
    const [expectedBasePath] = expected.path.split('?');

    const expectedPath = Object.entries(expected.pathParams || {}).reduce((acc, curr) => {
        const [key, value] = curr;
        const paramsRegex = new RegExp(`:${key}`);
        return acc.replace(paramsRegex, `${value}`);
    }, expectedBasePath);

    const regexPath = new RegExp(expectedPath);
    return !!regexPath.exec(receivedBasePath);
};
