import { createExpressMiddleware } from '@sayjava/deputy';

const mockMiddleware = createExpressMiddleware({ mocksDirectory: 'mocks' });
const callRemoteApi = (req, res) => {
    console.log('Call some remote api');
    res.send('result from remote api');
};

export default (req, res) => {
    if (process.env.NODE_ENV !== 'production') {
        return mockMiddleware(req, res);
    }

    return callRemoteApi(req, res);
};
