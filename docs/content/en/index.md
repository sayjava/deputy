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

<img src="/landing.png" width="1280" height="640" alt=""/>

## Why Use Deputy

<list :items="reasons"></list>

## Features

<list :items="features"></list>

## Quick Start

<code-group>
  <code-block label="NPM" active>

```bash
npx @sayjava/deputy@latest
```

  </code-block>
  <code-block label="Docker">

```bash
docker run -p 8080:8080 -p 8081:8081 @sayjava/deputy
```

  </code-block>
</code-group>

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
