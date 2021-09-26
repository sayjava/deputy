 <h1 align="center">Deputy</h1>
 <p align="center">
  <img src="ui/src/logo.svg" width="150">
 </p>
 <p align="center">
The easiest and quickest way to mock HTTP endpoints for development and testing purposes
 </p>
 <p align="center">
    <a href="https://sayjava.github.io/deputy/"><strong>Explore deputy docs »</strong></a>
 </p>
 <p align="center">
  <a href="https://sayjava.github.io/deputy/start">Quick Start »</a>
  <a href="https://sayjava.github.io/deputy/guide">Guide »</a>
  <a href="https://sayjava.github.io/deputy/api">API »</a>
 </p>
 <p align="center">
  <img src="https://github.com/sayjava/deputy/workflows/Build/badge.svg" />
  <img src="https://github.com/sayjava/deputy/workflows/Docs/badge.svg" />
  <img src="https://github.com/sayjava/deputy/workflows/Release/badge.svg" />
 </p>

# What is Deputy?

Deputy is an HTTP API mock server that can aid in rapid application development by mocking endpoints and configuring responses from configurations.

Deputy can also act as a testing server to validate what requests made by system under test.

# Quick Start

```shell
npx @sayjava/deputy
```

or

```shell
docker run -p 8080:8080 ghcr.io/sayjava/deputy
```


and test the endpoint

```shell
curl -X GET http://localhost:8080/hello
```

# Features

-   [Declarative request matching and response](https://sayjava.github.io/deputy/guide)
-   [Regex based request matching](https://sayjava.github.io/deputy/guide) (request path, headers and body matchers)
-   [Alternate and limit responses on same request](https://sayjava.github.io/deputy/guide)
-   [Templated based response](https://sayjava.github.io/deputy/guide), e.g `"Task is {{req.queryParams.name}}"`
-   [NodeJS HTTP/Express Middleware](https://sayjava.github.io/deputy/start)
-   [HTTP request validations](https://sayjava.github.io/deputy/assertions)
-   [Simulate response delays and network failures](https://sayjava.github.io/deputy/guide)
-   [Serverless compatible](https://sayjava.github.io/deputy)

# Examples

Here are some scenarios where `Deputy` can be used to mock endpoints. Start the server on the default 8080 port

```shell
npx @sayjava/deputy
```

### Regex paths

```shell
npx @sayjava/deputy -b '[
  {
    "name": "Match any task with id",
    "request": { "path": "/tasks/[0-9]+" },
    "response": {
      "body": "found it"
    }
  }
]
'
```

to match requests like these:

```shell
curl http://localhost:8080/tasks/2
curl http://localhost:8080/tasks/10
```

### Request headers

e.g `{"user-a∫gent": "Chrome|Apple*"}`

```shell
npx @sayjava/deputy -b '[
  {
    "name": "Match requests coming from Apple devices or Chrome",
    "request": {
      "path": "/tasks/[0-9]+",
      "headers": {
        "user-agent": "Chrome|Apple*"
      }
    },
    "response": {
      "body": "Found on a mac or chrome"
    }
  }
]
'
```

to match requests like:

```shell
curl http://localhost:8080/tasks/2 -H 'user-agent: Chrome'
```

### Templated response

HTTP response can be templated using Handlebars syntax

```shell
@sayava/deputy -b `[
  {
    "request": {
      "path": "/greet/:name",
      "pathParams": {
        "name": "[a-z]+"
      }
    },
    "response": {
      "body": "Hello {{req.pathParams.name}}"
    }
  }
]`
```

to match requests and respond with the template:

```shell
curl http://localhost:8080/greet/jane
```

and respond with `Hello jane`

### Request body matchers

e.g `{"user":"john_[a-z]+"}`

```shell
@sayjava/deputy -b '[{
  "name": "Match requests with users with names like john_xxx",
  "request": {
    "path": "/tasks",
    "method": "POST",
    "body": {
      "user": "john_[a-z]+"
    }
  },
  "response": {
    "statusCode": "201",
    "body": "Task created by {{req.body.user}}"
  }
}]
'
```

to match requests like:

```shell
curl -X POST http://localhost:8080/tasks -H "content-type:application/json" -d '{ "user": "john_doe", "name": "pay up" }'
```

### Asserts received requests

Asserts that Deputy has received a request with that path at least twice and at most 10 times

```shell
curl -X PUT http://localhost:8080/_/api/requests/assert -H "content-type:application/json" -d '[
  {
    "request": {
      "path": "/todo/2",
       "count": {
          "atLeast": 2,
          "atMost": 10
        }
    }
  }
]'
```

### Asserts the sequence requests are received

Asserts that Deputy has received a request with that path at least twice and at most 10 times

```shell
curl -X PUT http://localhost:8080/_/api/requests/sequence -H "content-type:application/json" -d '[
  {
    "request": {
      "path": "/todo/2"
    }
  },
  {
    "request": {
      "path": "/todosdss/20"
    }
  }
]'
```

see the [Mock Guide](http://sayjava.github.com/deputy)

### Programmatically Use cases (Express Middleware / NodeJS HTTP Middleware)

```javascript
const express = require('express');
const { deputyHandler } = require('@sayjava/deputy');

const app = express();
app.use(express.static(__dirname + '/views'));

// Existing route
app.get('/', (req, res) => res.render('index', { title: 'Hey', message: 'Hello there!' }));

// Mount the middleware on /api.
app.use('/api', deputyHandler({ config: { fromFile: 'api.json' } }));

app.listen(3000, () => console.info(`App started on 3000`));
```

### Serverless Mock Server

See [Serverless Deployment](examples/deputy-with-lambda/README.md)

### Full Documentation

[Full Documentation](https://sayjava.github.io/deputy)
