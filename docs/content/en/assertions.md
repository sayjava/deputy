---
title: Testing
position: 10
---

Deputy can be used to in a functional or user acceptance testing environment to validate an application's functionalities without/without making requests to external services.

![Test Environment](/test_environment.png)

Requests made to/via Deputy are recorded and can be asserted against in a test environment.

## Assertions

The server can validate how many times a request is received and matched if at all.

If the validation passes, the server returns an `HTTP 201` but if fails, the server returns an `HTTP 406` with reason why it fails

### Request was matched at least once

Check if the requests have been received and matched at least once

```shell
# Responds with 201
curl -X PUT -H "Content-Type: application/json" http://localhost:8081/api/requests/assert -d '
[
  {
    "request": {
      "path": "/tasks/123"
    }
  },
  {
    "request": {
      "path": "/tasks/12"
    }
  }
]
'
```

### Requests was matched by an upper limit count

Check if the requests have been received and matched `at most` twice

```shell
# Responds with 201 if it were matched
curl -X PUT -H "Content-Type: application/json" http://localhost:8081/api/requests/assert -d '
[
  {
    "request": {
      "path": "/tasks/123"
    },
    "limit": {
      "atMost": 2
    }
  }
]
'
```

### Requests was matched by a lower limit count

Check if the requests have been received and matched `at least` twice

```shell
# Responds with 201 if it were matched
curl -X PUT -H "Content-Type: application/json" http://localhost:8081/api/requests/assert -d '
[
  {
    "request": {
      "path": "/tasks/123"
    },
    "limit": {
      "atLeast": 2
    }
  }
]
'
```

### Request was matched by an exact number

Check if the requests have been received exactly twice

```shell
# Responds with 201 if it were matched
curl -X PUT -H "Content-Type: application/json" http://localhost:8081/api/requests/assert -d '
[
  {
    "request": {
      "path": "/tasks/123"
    },
    "limit": {
      "atLeast": 2,
      "atMost": 2
    }
  }
]
'
```

### Request was never received

Check if the requests was never matched

```shell
# Responds with 201 if it were matched
curl -X PUT -H "Content-Type: application/json" http://localhost:8081/api/requests/assert -d '
[
  {
    "request": {
      "path": "/tasks/123"
    },
    "limit": {
      "atMost": 0
    }
  }
]
'
```

<!--
### Requests were received at least at an interval

Check if this request was received more than once and at least `time` in seconds apart. This will implicitly require that at least 2 requests was received and matched

```shell
# Check that requests were received at least 10 seconds apart
# Responds with 201 if it were matched
curl -X PUT -H "Content-Type: application/json" http://localhost:8081/api/requests/interval -d '
{
  "requests": [
    {
      "path": "/users/123"
    },
    {
      "path": "/tasks/123"
    }
  ],
  "interval": {
    "atLeast": 10
  }
}
'
```

### Requests were received at most at an interval

Check if this request was received more than once and at least `time` in seconds apart. This will implicitly require that at most 2 requests was received and matched

```shell
# Check that requests were received at most 10 seconds apart
# Responds with 201 if it were matched
curl -X PUT -H "Content-Type: application/json" http://localhost:8081/api/requests/assert -d '
[
  {
    "path": "/tasks/123",
    "interval": {
      "atMost": 10
    }
  }
]
'
``` -->

## Sequence Assertions

Request can also matched int the order in which they are received by the server.

### Requests were received in a particular order

Check if the requests were received in the specific order

```shell
# Responds with 201 if it were matched
curl -X PUT -H "Content-Type: application/json" http://localhost:8081/api/requests/sequence -d '
[
  {
    "path": "/tasks/123"
  },
  {
    "path": "/tasks/123/docs/icon.png"
  }
]
'
```
