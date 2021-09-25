import fs from 'fs';
import { createServer } from '../../server';
import request from 'supertest';

jest.mock('fs', () => {
    return {
        existsSync: jest.fn(() => true),
        readFileSync: jest.fn(),
    };
});

beforeEach(() => {
    // @ts-ignore
    fs.readFileSync.mockReset();
});

// console.log = jest.fn();
test('validates that query parameters work', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test expectations
            request:
                path: /tasks
                method: GET
                queryParams:
                    id: '[a-z]'
            response:
                body: Query worked
    `);

    const { server } = await createServer({});
    const res = await request(server).get('/tasks?id=visitShop').send();

    expect(res.status).toBe(200);
    expect(res.text).toMatchInlineSnapshot(`"\\"Query worked\\""`);
});

test('validates that path parameters work', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test expectations
            request:
                path: /tasks/:id/doc/:docId
                method: GET
                pathParams:
                    id: '[a-z]+'
                    docId: '[a-z]+'
            response:
                body: Query worked
    `);

    const { server } = await createServer({});
    const res = await request(server).get('/tasks/apple/doc/new').send();

    expect(res.status).toBe(200);
});

test('validates that the middleware mounts on the route', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test expectations
            request:
                path: /tasks/:id/doc/:docId
                method: GET
                pathParams:
                    id: '[a-z]+'
                    docId: '[a-z]+'
            response:
                body: Query worked
    `);

    const { server } = await createServer({});
    const res = await request(server).get('/api/tasks/apple/doc/new').send();

    expect(res.status).toBe(200);
    expect(res.body).toMatchInlineSnapshot(`"Query worked"`);
});

test('validates that response headers are sent', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test expectations
            request:
                path: /tasks/:id/doc/:docId
                method: GET
                pathParams:
                    id: '[a-z]+'
                    docId: '[a-z]+'
            response:
                headers:
                   x-client-headers: some-headers
                   content-type: application/json
                body: a response
    `);

    const { server } = await createServer({});
    const res = await request(server).get('/api/tasks/apple/doc/new').send();

    expect(res.status).toBe(200);
    expect(res.body).toMatchInlineSnapshot(`"a response"`);
    expect(res.headers).toEqual(
        expect.objectContaining({
            'content-type': 'application/json',
            'x-client-headers': 'some-headers',
        }),
    );
});
