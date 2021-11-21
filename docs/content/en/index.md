---
title: Deputy
menuTitle: Introduction
description: "Deputy, an HTTP mocking server"
category: Getting Started
position: 1
features:
  - Declarative Mock definition
  - Integrated Web UI
  - Rest API
  - Functional Testing
  - Forward Proxying
  - HTTP/HTTPS support
  - Express Middleware
---

Mock your APIs for fast, robust and comprehensive testing

Deputy is a simulator for HTTP-based APIs. Some might consider it a service virtualization tool or a mock server.

<img src="/landing.png" width="1280" height="640" alt=""/>

It enables you to stay productive when an API you depend on doesn't exist or isn't complete. It supports testing of edge cases and failure modes that the real API won't reliably produce. And because it's fast it can reduce your build time from hours down to minutes

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
const express = require("express");
const { createExpressMiddleware } = require("@sayjava/deputy");

const app = express();
const mockAPI = createExpressMiddleware({ mocksFolder: "fixtures" });

// mount the mock on a middleware endpoint
app.use("/api", mockAPI);
app.listen(3000, () => console.log("server started"));
```
