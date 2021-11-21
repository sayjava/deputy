---
title: REST API
position: 9
---

Deputy Server exposes a set of RESTFUL APIs that are useful for manipulating mocks and retrieving request records from
ths server.

The API server is started on the same port as the UI server. `http://localhost:8081`

## Mocks

### List

`GET http://localhost:8081/api/mocks` will list all the configured mocks on the server

### Create

`POST http://localhost:8081/api/mocks` will create new mocks on the server, for example:

```shell script
# Responds with a 201
curl -X POST http://localhost:8081/api/mocks -H 'content-type=application/json' -d '
[
  {
    "requests": {
      "path": "/hi"
    }
  },
  {
    "requests": {
      "path": "/halo"
    }
  }
]
'
```

### Update

`PUT http://localhost:8081/api/mocks` will create new mocks on the server, for example:

```shell script
# Responds with a 201
curl -X POST http://localhost:8081/api/mocks -H 'content-type=application/json' -d '
[
  {
    "id": "mock-id-1",
    "requests": {
      "path": "/hi"
    }
  },
  {
    "id": "mock-id-2",
    "requests": {
      "path": "/halo"
    }
  }
]
'
```

see more about [mocks](guide.md) here

### Delete

`DELETE http://localhost:8081/api/mocks/` will delete the mock with the specified body id:

```shell
# Responds with a 201
curl -X DELETE http://localhost:8081/api/mocks -H 'content-type=application/json' -d '
{
    "id": "mock-id-1"
}
'
```

see more about [mocks](guide.md) here

## Records

The server stores all the received requests alongside the matched mocks in memory

### List Records

`GET http://localhost:8081/api/records` will list all the records received by the server

### Clear Records

`POST http://localhost:8081/api/clear` will clear all the records received by the server

## Reset Records & Mocks

`POST http://localhost:8081/api/reset` will delete all the records and mocks
