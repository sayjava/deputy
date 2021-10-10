import fs from 'fs';
import request from 'supertest';
import { createServer } from '..';

jest.mock('fs', () => {
    return {
        existsSync: jest.fn(() => true),
        readFileSync: jest.fn(),
        readdirSync: () => ['mocks.yml'],
        statSync: () => ({ isDirectory: () => true }),
    };
});

beforeEach(() => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReset();
});

test('return accepted http 202', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test expectations
            request:
                path: /tasks
                method: GET
            response:
                body: Query worked
    `);

    const { mockServer, apiServer } = await createServer({});
    await request(mockServer).post('/tasks').send();
    await request(mockServer).get('/tasks?finished=true').send();

    const res = await request(apiServer).get('/_/api/records');

    expect(res.status).toBe(200);

    expect(res.body.map((rec) => ({ url: rec.request.path }))).toMatchInlineSnapshot(`
            Array [
              Object {
                "url": "/tasks",
              },
              Object {
                "url": "/tasks?finished=true",
              },
            ]
      `);
});

test('all records are cleared', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test expectations
            request:
                path: /tasks
                method: GET
            response:
                body: Query worked
    `);

    const { mockServer, apiServer } = await createServer({});
    await request(mockServer).post('/tasks').send();
    await request(mockServer).get('/tasks?finished=true').send();

    await request(apiServer).post('/_/api/clear');
    const res = await request(apiServer).get('/_/api/records');

    expect(res.status).toBe(200);

    expect(res.body.map((rec) => ({ url: rec.request.path }))).toMatchInlineSnapshot(`Array []`);
});

test('reset server', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test expectations
            request:
                path: /tasks
                method: GET
            response:
                body: Query worked
    `);

    const { apiServer, mockServer } = await createServer({});
    await request(mockServer).post('/tasks').send();
    await request(mockServer).get('/tasks?finished=true').send();

    await request(apiServer).post('/_/api/reset');
    const records = await request(apiServer).get('/_/api/records');
    const mocks = await request(apiServer).get('/_/api/mocks');

    expect(records.body.map((rec) => ({ url: rec.request.path }))).toMatchInlineSnapshot(`Array []`);
    expect(mocks.body.map((rec) => ({ url: rec.request.path }))).toMatchInlineSnapshot(`Array []`);
});

test('handle unsupported reset', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test expectations
            request:
                path: /tasks
                method: GET
            response:
                body: Query worked
    `);

    const { mockServer, apiServer } = await createServer({});
    await request(mockServer).post('/tasks').send();
    await request(mockServer).get('/tasks?finished=true').send();

    const res = await request(apiServer).delete('/_/api/reset');

    expect(res.status).toBe(404);
});

test('handle unsupported method', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test expectations
            request:
                path: /tasks
                method: GET
            response:
                body: Query worked
    `);

    const { mockServer, apiServer } = await createServer({});
    await request(mockServer).post('/tasks').send();
    await request(mockServer).get('/tasks?finished=true').send();

    const res = await request(apiServer).delete('/_/api/records');

    expect(res.status).toBe(404);
});
