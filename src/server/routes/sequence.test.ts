import fs from 'fs';
import { createServer } from '..';
import request from 'supertest';

jest.mock('fs', () => {
    return {
        existsSync: jest.fn(() => true),
        readFileSync: jest.fn(),
    };
});

beforeEach(() => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReset();
});

test('return a 406  for requests less than 2', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test expectations
            request:
                path: /tasks
                method: GET
            response:
                body: Query worked

        -   name: test expectations
            request:
                path: /tasks
                method: POST
            response:
                body: Query worked
    `);
    const { apiServer } = await createServer({});
    const res = await request(apiServer)
        .put('/_/api/requests/sequence')
        .set('content-type', 'application/x-yaml')
        .send(`-`);
    expect(res.status).toBe(406);
    expect(res.body).toMatchInlineSnapshot(`
        Object {
          "actual": "Received 1 requests",
          "expected": "At least 2 requests",
          "message": "At least 2 requests is needed for verifying a sequence",
          "records": Array [],
        }
    `);
});

test('return the error from a failed verification', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test expectations
            request:
                path: /tasks
                method: GET
            response:
                body: Query worked

        -   name: test expectations
            request:
                path: /tasks
                method: POST
            response:
                body: Query worked
    `);

    const { apiServer } = await createServer({});

    const res = await request(apiServer).put('/_/api/requests/sequence').set('content-type', 'application/x-yaml')
        .send(`
        - path: /tasks
          method: POST
        
        - path: /tasks
          method: GET
        `);

    expect(res.status).toBe(406);
    expect(res.body).toMatchInlineSnapshot(`
            Object {
              "actual": Array [],
              "expected": Array [
                "POST:/tasks",
                "GET:/tasks",
              ],
              "message": "Requests matched are not matched",
              "records": Array [],
            }
      `);
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

        -   name: test expectations
            request:
                path: /tasks
                method: POST
            response:
                body: Query worked
    `);

    const { apiServer, mockServer } = await createServer({});

    await request(mockServer).post('/tasks');
    await request(mockServer).get('/tasks');

    const res = await request(apiServer).put('/_/api/requests/sequence').set('content-type', 'application/x-yaml')
        .send(`
        - path: /tasks
          method: POST
        
        - path: /tasks
          method: GET
    `);

    expect(res.status).toBe(202);
});

test('return error for unmatched sequence', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test expectations
            request:
                path: /tasks
                method: GET
            response:
                body: Query worked

        -   name: test expectations
            request:
                path: /tasks
                method: POST
            response:
                body: Query worked
    `);

    const { mockServer, apiServer } = await createServer({});
    await request(mockServer).get('/tasks');
    await request(mockServer).get('/tasks');

    const res = await request(apiServer).put('/_/api/requests/sequence').set('content-type', 'application/x-yaml')
        .send(`
        - path: /tasks
          method: POST
        
        - path: /tasks
          method: GET
        `);

    expect(res.status).toBe(406);
});
