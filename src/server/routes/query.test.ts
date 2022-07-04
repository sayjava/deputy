import fs from 'fs';
import { createServer } from '..';
import request from 'supertest';

jest.mock('fs', () => {
    return {
        existsSync: jest.fn(() => true),
        readFileSync: jest.fn(),
        readdirSync: () => ['mocks.json'],
        statSync: () => ({ isDirectory: () => true }),
    };
});

describe('Query Parameters', () => {
    beforeEach(() => {
        // @ts-ignore
        fs.readFileSync.mockReset();

        // @ts-ignore: Jest Mock
        fs.readFileSync.mockReturnValueOnce(
            JSON.stringify([
                {
                    request: {
                        path: '/todos',
                        method: 'GET',
                        queryParams: {
                            id: '[a-z]+',
                            done: 'true|false',
                        },
                    },
                    response: {
                        status: 201,
                    },
                },
                {
                    request: {
                        path: '/project',
                        method: 'GET',
                        queryParams: {},
                    },
                    response: {
                        status: 201,
                    },
                },
                {
                    request: {
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
                    },
                    response: {
                        status: 200,
                    },
                },
                {
                    request: {
                        path: '/doc',
                        method: 'GET',
                        queryParams: {
                            url: 'http://(.*).com',
                        },
                    },
                    response: {
                        status: 200,
                    },
                },
                {
                    request: {
                        path: '/doc?id=[0-9]+',
                        headers: {},
                        queryParams: {
                            done: 'true|false',
                        },
                        method: 'GET',
                    },
                    response: {
                        status: 200,
                    },
                },
            ]),
        );
    });

    it('matches basic query parameters', async () => {
        const { mockServer } = await createServer({});
        const trueRes = await request(mockServer).get('/todos?id=take&done=true').send();
        const falseRes = await request(mockServer).get('/todos?id=something&done=false').send();
        const noneRes = await request(mockServer).get('/todos?id=23').send();
        const randomRes = await request(mockServer).get('/todos?done=true&id=random').send();

        await expect(falseRes.status).toMatchInlineSnapshot(`201`);
        await expect(trueRes.status).toMatchInlineSnapshot(`201`);
        await expect(randomRes.status).toMatchInlineSnapshot(`201`);
        await expect(noneRes.status).toMatchInlineSnapshot(`404`);
    });

    it('matches optional query parameters', async () => {
        const { mockServer } = await createServer({});

        const res = await request(mockServer).get('/project?done=false').send();
        await expect(res.status).toMatchInlineSnapshot(`201`);
    });

    it('matches query string parameters and path parameters', async () => {
        const { mockServer } = await createServer({});

        const matching = await request(mockServer).get('/todo/12/owner/4?done=true').send();
        await expect(matching.status).toMatchInlineSnapshot(`200`);

        const noneMatching = await request(mockServer).get('/todo/20/owner/4?done=true').send();
        await expect(noneMatching.status).toMatchInlineSnapshot(`404`);
    });

    it('matches encode url query', async () => {
        const { mockServer } = await createServer({});
        const matching = await request(mockServer)
            .get(`/doc?url=${encodeURIComponent('http://yarn.com')}`)
            .send();
        await expect(matching.status).toMatchInlineSnapshot(`200`);
    });

    it('merges query and path params', async () => {
        const { mockServer } = await createServer({});
        const matching = await request(mockServer).get('/doc?id=12&done=false').send();
        await expect(matching.status).toMatchInlineSnapshot(`200`);
    });
});
