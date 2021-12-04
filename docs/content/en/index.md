---
title: Deputy
menuTitle: Introduction
description: 'Deputy, an HTTP mocking server'
category: Getting Started
position: 1
features:
    - Declarative mock definitions
    - Integrated Web UI
    - Rest API
    - Functional testing
    - Forward Proxying
    - HTTP/HTTPS support
    - Express middleware
reasons:
    - Stay productive during development with simulated APIs
    - Mock edge cases in test simulating responses
    - Debug HTTP requests/response via UI
    - Generate sequence diagrams for user journeys
    - Easy setup `npx @sayjava/deputy`
---

Deputy is a simulator for HTTP-based APIs that is useful in software development and comprehensive testing.

<img src="landing.png" width="1280" height="640" alt=""/>

## Quick Start

Create a mock file and put it in a folder called `mocks`

```json
[
    {
        "request": {
            "path": "/user/(d+)/slug/(.*)",
            "params": {
                "output_type": "json|xml"
            }
        },
        "response": {
            "status": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": [
                {
                    "id": "slug-id",
                    "content": "The post content"
                }
            ]
        }
    }
]
```

<code-group>
  <code-block label="NPM" active>

```bash
npx @sayjava/deputy
```

  </code-block>
  <code-block label="Docker">

```bash
docker run -p 8080:8080 -p 8081:8081  ghcr.io/sayjava/deputy
```

  </code-block>
</code-group>

```bash
curl -X GET http://localhost:8080/user/20/slug/super-dupa-content
```

## Why Use Deputy

<list :items="reasons"></list>

## Features

<list :items="features"></list>

## Programmatic

```javascript
const express = require('express');
const { createExpressMiddleware } = require('@sayjava/deputy');

const app = express();
const mockAPI = createExpressMiddleware({ mocksFolder: 'fixtures' });

// mount the mock on a middleware endpoint
app.use('/api', mockAPI);
app.listen(3000, () => console.log('server started'));
```
