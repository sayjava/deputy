---
id: api
title: API
sidebar_label: API
slug: /api
has_toc: true
nav_order: 4
---

## Behave Server API

Behave Server exposes a set of APIs that are useful for manipulating behaviors or retrieving records from
Behave Server.

## Behaviors

### List

`GET /_/api/behaviors` will list all the configured behaviors on the server for example:

```shell script
curl http://localhost:8080/_/api/behaviors 
```

### Create

`PUT http://localhost:8080/_/api/behaviors` will create new behaviors on the server, for example:

```shell script
# Responds with a 201
curl -X PUT http://localhost:8080/_/api/behaviors -d '
- requests:
    path: "/hi"
- requests:
    path: "/halo"
'
```

see more about [Behaviors](guide.md) here

### Delete

`DELETE http://localhost:8080/_/api/behaviors/:id` will delete the behavior with the specified id, for example:

```shell
# Responds with a 201
curl -X DELETE http://localhost:8080/_/api/behaviors/:id
```

see more about [Behaviors](guide.md) here


## Records

The server stores all the received requests alongside the matched Behaviors in memory

### List

`GET http://localhost:8080/_/api/records` will list all the records received by the server, for example:

```shell
# Responds with a 200 and a list of requests and matched behaviors
curl -X GET http://localhost:8080/_/api/records
```

## Delete
`PUT http://localhost:8080/_/api/reset` will delete all the records and behaviors, for example:

```shell
# Clear all records and behaviors
curl -X PUT http://localhost:8080/_/api/reset
```