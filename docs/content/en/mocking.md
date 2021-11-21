---
title: Mocking Definition
menuTitle: Mocking
position: 4
---

<code-group>
  <code-block label="YAML">

```yaml
# Optional
id: mock-id

# Optional
name: Name of this mock

# Optional
description: Description for this mock

# Required
request:
  # Optional: defaults to matching any method
  # Regex: true
  method: GET|POST|PUT|DELETE

  # Required: the path to match this mock to
  # Regex: true
  path: a/path/to/match

  # Optional: list of header values to use for matching requests
  # Regex: true
  headers:
    x-some-custom-header: any value

  # Optional: JSON/Text used to match incoming requests to this mock
  # Regex: true
  body: json/text

# Optional: Defines a destination to forward the request to instead
proxy:
  # Optional: The protocol to use to forward request. Defaults to the original request protocol
  protocol: https|http

  # Optional: remote port of the server. Defaults to the original request port
  port: number

  #  Optional
  followRedirect: boolean

  # Optional
  skipVerifyTLS: boolean

  # Optional:  extra headers to forward to the remote host
  headers: map

# Optional
response:
  # Optional: Defaults to 200
  status: any http status code

  #Optional: Defaults to empty string
  body: json object/text

  # Optional: Response headers, key-value pairs
  headers:
    some_header: some_header_value_like_cookies

  # Optional: defaults to immediately
  delay: seconds to delay the response. defaults to 0

# Optional: defaults to unlimited
limit: (number|unlimited). how many times this mock should be used. defaults to unlimited
```

  </code-block>
  <code-block label="JSON">

```json
{
  "id": "mock-id",
  "name": "Name of this mock",
  "description": "Description for this mock",
  "request": {
    "method": "GET|POST|PUT|DELETE",
    "path": "a/path/to/match",
    "headers": {
      "x-some-custom-header": "any value"
    },
    "body": "json/text"
  },
  "proxy": {
    "protocol": "https|http",
    "port": "number",
    "followRedirect": "boolean",
    "skipVerifyTLS": "boolean",
    "headers": "map"
  },
  "response": {
    "status": "any http status code",
    "body": "json object/text",
    "headers": {
      "some_header": "some_header_value_like_cookies"
    },
    "delay": "seconds to delay the response. defaults to 0"
  },
  "limit": "(number|unlimited). how many times this mock should be used. defaults to unlimited"
}
```

  </code-block>
</code-group>

Mocks can either be created by initialization see [Start Guide](./start), the [REST API](./api) or via the dashboard

## Request Definition

### Simple Path

Deputy server will default to `.*` i.e match all methods and `HTTP 200` response code for matched Behaviors if they are omitted from the Behavior document.

```json
[
  {
    "request": {
      "path": "/tasks/a_simple_task"
    },
    "response": {
      "body": {
        "name": "A simple task"
      }
    }
  }
]
```

```shell
# Responds with a 200 Ok "A sample task"
curl -X GET http://localhost:8080/tasks/a_simple_task

# Responds with a 404 Not Found
curl -X GET http://localhost:8080/tasks/another_task
```

### Regex Paths

Behaviors can use regex paths for matching a request to a configured Behavior. e.g

```json
[
  {
    "request": {
      "path": "/tasks/[0-9]+"
    },
    "response": {
      "body": {
        "name": "Regex based url"
      }
    }
  }
]
```

```shell
# Responds with a 200 Ok
curl -X GET http://localhost:8080/tasks/123

# Responds with a 200 Ok
curl -X GET http://localhost:8080/tasks/2

# Responds with a 404 Not Found
curl -X GET http://localhost:8080/tasks/a_simple_taks
```

### Path Parameters

The server can match http requests using dynamic path parameters e.g

```json
[
  {
    "request": {
      "path": "/tasks/{id}/docs/{docId}",
      "pathParams": { "id": "[0-9]+", "docId": "[a-z]+.jpg" }
    },
    "response": { "body": { "name": "Task doc" } }
  }
]
```

```shell
# Responds with a 200
curl -X GET http://localhost:8080/tasks/123/doc/image.jpg

# Responds with a 404
curl -X GET http://localhost:8080/tasks/123/doc/cat.png
```

### Query Parameters

The server can also match dynamic query parameters. e.g

```json
[
  {
    "request": {
      "path": "/tasks/[0-9]+/?completed={isCompleted}",
      "queryParams": {
        "isCompleted": "true|false"
      }
    },
    "response": {
      "body": {
        "name": "Some completed tasks"
      }
    }
  }
]
```

```shell
# Responds with a 200
curl -X GET http://localhost:8080/tasks/123?isCompleted=true
```

### Headers

The server can match requests based on http request header values. The configured request header values will matched as a subset of the received request headers.

```json
{
  "request": {
    "path": "/tasks/[0-9]+",
    "headers": {
      "X-Mock-Id": "mock-[a-z]+"
    }
  },
  "response": {
    "body": {
      "name": "match header values"
    }
  }
}
```

```shell
# Responds with a 200
curl -X GET http://localhost:8080/tasks/123 -H "X-Mock-Id: mock-abcde"

# Responds with a 404
curl -X GET http://localhost:8080/tasks/123
```

### Request Methods

```json
[
  {
    "request": {
      "path": "/tasks/[0-9]+",
      "method": "DELETE"
    },
    "response": {
      "body": {
        "name": "Task has been deleted"
      }
    }
  }
]
```

```shell
# Respond with a 200
curl -X DELETE http://localhost:8080/tasks/123

# Respond with a 404
curl http://localhost:8080/tasks/123
```

### Request Body

Behaviors can also be matched using the request body. The server will inspect the content-type of the request method to determine how to handle the request body.

#### JSON Body

Http requests with a `Content-Type: application/json` header will have its body treated like a json object. The request body will be matched as a superset of the Behavior body. e.g

```json
[
  {
    "request": {
      "path": "/tasks",
      "method": "POST",
      "body": {
        "user": "john_doe"
      }
    },
    "response": {
      "statusCode": 200,
      "body": {
        "name": "Task has been deleted"
      }
    }
  }
]
```

```shell
# Responds with a 200
curl -X POST http://localhost:8080/tasks -d '{ "name": "simple-task", "user": "john_doe" }' -H "Content-Type: application/json"

# Responds with a 404
curl -X POST http://localhost:8080/tasks -d '{ "name": "simple-task" }' -H "Content-Type: application/json"
```

#### Plain Text Body

Requests without a specified `Content-Type` will default to string

```json
[
  {
    "request": {
      "path": "/tasks",
      "body": "john_doe"
    },
    "response": {
      "statusCode": 200,
      "body": "no tasks for this person"
    }
  }
]
```

```shell
# Responds with a 200
curl -X GET http://localhost:8080/tasks -d '"john_doe"'

# Responds with a 404
curl -X POST http://localhost:8080/tasks -d 'someone_else'
```

#### Regex Body

Behaviors can also be matched using a regex body either as a json document or plain text. e.g

```json
[
  {
    "request": {
      "path": "/tasks",
      "method": "POST",
      "body": {
        "name": "task-[0-9]+"
      }
    },
    "response": {
      "body": {
        "name": "Task has been deleted"
      }
    }
  }
]
```

```shell
# Responds with a 200
curl -X POST http://localhost:8080/tasks -d '{ "name": "task-123", id: 2 }' -H "Content-Type: application/json"

# Responds with a 404
curl -X POST http://localhost:8080/tasks -d '{ "name": "other_tasks", id: 2 }' -H "Content-Type: application/json"
```

## Response

The server response can also be tailored using the Behavior document.

<!-- ## Templated Response (Handlebars)

Responses can be generated using handlebar templates.

```shell
  curl -X POST http://localhost:8080/tasks -H "content-type:application/json" -H "cookie=accepted=false" -d '
  { "name": "eat out", "owner": "me" }'
```

A templated response can look like this.

```handlebars
  {
    {{#with req.body}}
    "text":         "{{name}}",
    "owner":        "{{owner}}",
    {{/with}}
    "url":          "{{req.path}}",
    "done":         "{{req.queryParams.isDone}}",
    "accepted":     "{{req.cookies.accepted}}"
  }
``` -->

### Limited

The server can limit the amount of instance a Behavior is used to respond to the http requests it matches. Http requests received after the response limit has been reached will result in a `404` response.

The default response limit is `unlimited`. e.g

```yaml
- request:
    path: /tasks/123
  response:
    statusCode: 200
    body: Task 123
  limit: 2
```

```shell
# Responds with a 200
curl -X GET http://localhost:8080/tasks/123

# Responds with a 200
curl -X GET http://localhost:8080/tasks/123

# Responds with a 404
curl -X GET http://localhost:8080/tasks/123
```

Response limits can be combined to create some interesting scenarios, e.g first respond with 200s and then fail afterwards

The first 2 requests will be successful

```json
[
  {
    "request": {
      "path": "/tasks/123"
    },
    "response": {
      "statusCode": 200,
      "body": "Task 123"
    },
    "limit": 2
  }
]
```

Subsequent requests should fail

```json
[
  {
    "request": {
      "path": "/tasks/123"
    },
    "response": {
      "statusCode": 500,
      "body": "Sever blew up"
    }
  }
]
```

```shell

# Responds with a 200
curl -X GET http://localhost:8080/tasks/123

# Responds with a 200
curl -X GET http://localhost:8080/tasks/123

# Responds with a 500
curl -X GET http://localhost:8080/tasks/123
```

### Delayed

By default, responses are sent immediately to the client when matched but the server can be instructed to delay in seconds when the server should send the response. e.g

```json
[
  {
    "request": {
      "path": "/tasks/123"
    },
    "response": {
      "body": "some tasks",
      "delay": 120
    }
  }
]
```

```shell

# Responds with a 200 after 120 seconds
curl -X GET http://localhost:8080/tasks/123

```
