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

test('add a successful mock', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test mocks
            request:
                path: /tasks
                method: POST
                queryParams:
                    id: '[a-z]'
            response:
                headers:
                  Content-Type: application/json
    `);

    const { apiServer } = await createServer({});
    const res = await request(apiServer).post('/api/mocks').set('content-type', 'application/x-yaml').send(`
         -  name: test mocks
            request:
                path: /tasks
                method: POST
                queryParams:
                    id: '[a-z]'
            response:
                headers:
                  Content-Type: application/json
        `);

    expect(res.status).toBe(201);
});

test('add a single mock', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test mocks
            request:
                path: /tasks
                method: POST
                queryParams:
                    id: '[a-z]'
            response:
                headers:
                  Content-Type: application/json
    `);

    const { apiServer } = await createServer({});
    const res = await request(apiServer).post('/api/mocks').set('content-type', 'application/x-yaml').send(`
            name: test mocks
            request: 
                path: tasks
                method: POST
        `);

    expect(res.status).toBe(201);
});

test('fail adding a non valid mock', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   name: test mocks
            request:
                path: /tasks
                method: POST
                queryParams:
                    id: '[a-z]'
            response:
                headers:
                  Content-Type: application/json
    `);

    const { apiServer } = await createServer({});
    const res = await request(apiServer).post('/api/mocks').set('content-type', 'application/x-yaml').send(`
            - name: test mocks
              request: 
                method: POST
              response:
        `);

    expect(res.status).toBe(500);
    expect(res.body).toMatchInlineSnapshot(`
        Object {
          "message": "Request requires a path",
        }
    `);
});

test('remove a mock', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   id: sample-mock
            name: test mocks
            request:
                path: /tasks
                method: GET
            response:

    `);
    const { apiServer } = await createServer({});
    const res = await request(apiServer)
        .delete('/api/mocks')
        .set('content-type', 'application/x-yaml')
        .send(`id: sample-mock`);

    expect(res.status).toBe(201);
    expect(res.body).toMatchInlineSnapshot(`
            Object {
              "message": "ok",
            }
      `);
});

test('update a mock', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   id: sample-mock
            name: test mocks
            request:
                path: /tasks
                method: GET
            response:

    `);
    const { apiServer } = await createServer({});

    await request(apiServer).put('/api/mocks').set('content-type', 'application/x-yaml').send(` 
            id: sample-mock 
            request: 
                path: /somewhere
            response: 
                status: 200
        `);

    const res = await request(apiServer).get('/api/mocks');

    expect(res.body).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "sample-mock",
            "name": "Mock",
            "request": Object {
              "path": "/somewhere",
            },
            "response": Object {
              "status": 200,
            },
          },
        ]
    `);
});

test('update many mocks', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   id: mock1
            name: test mocks
            request:
                path: /mock1
                method: GET
            response:

        -   id: mock2
            name: test mocks
            request:
                path: /mock2
                method: GET
            response:

    `);
    const { apiServer } = await createServer({});

    await request(apiServer).put('/api/mocks').set('content-type', 'application/x-yaml').send(` 
            - id: mock1
              request: 
                path: /somewhere 
              response: 
                status: 200
            - id: mock2
              request: 
                path: /another-place 
              response: 
                status: 200
        `);

    const res = await request(apiServer).get('/api/mocks');

    expect(res.body).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "mock1",
            "name": "Mock",
            "request": Object {
              "path": "/somewhere",
            },
            "response": Object {
              "status": 200,
            },
          },
          Object {
            "id": "mock2",
            "name": "Mock",
            "request": Object {
              "path": "/another-place",
            },
            "response": Object {
              "status": 200,
            },
          },
        ]
    `);
});

test('re-order mocks', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   id: mock1
            name: test mocks
            request:
                path: /mock1
                method: GET
            response:

        -   id: mock2
            name: test mocks
            request:
                path: /mock2
                method: GET
            response:

    `);
    const { apiServer } = await createServer({});

    const res = await request(apiServer).post('/api/mocks/order').set('content-type', 'application/x-yaml').send(` 
            ids:
                - mock2
                - mock1
        `);

    expect(res.status).toBe(201);

    const { body: mocks } = await request(apiServer).get('/api/mocks');
    expect(mocks).toMatchInlineSnapshot(`
        Array [
          Object {
            "id": "mock2",
            "limit": "unlimited",
            "name": "test mocks",
            "request": Object {
              "method": "GET",
              "path": "/mock2",
            },
            "response": null,
          },
          Object {
            "id": "mock1",
            "limit": "unlimited",
            "name": "test mocks",
            "request": Object {
              "method": "GET",
              "path": "/mock1",
            },
            "response": null,
          },
        ]
    `);
});

test('retrieve all mocks', async () => {
    // @ts-ignore: Jest Mock
    fs.readFileSync.mockReturnValueOnce(`
        -   id: sample-mock
            name: test mocks
            request:
                path: /tasks
                method: GET
            response:

    `);

    const { apiServer } = await createServer({});
    const res = await request(apiServer).get('/api/mocks');

    expect(res.status).toBe(200);
    expect(res.body).toMatchInlineSnapshot(`
            Array [
              Object {
                "id": "sample-mock",
                "limit": "unlimited",
                "name": "test mocks",
                "request": Object {
                  "method": "GET",
                  "path": "/tasks",
                },
                "response": null,
              },
            ]
      `);
});
