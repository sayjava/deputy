---
title: Quick Start
---

## Start Server

```shell
docker run -p 8080:8080 ghcr.io/sayjava/deputy
```

This will start the server on port `8080` and ready to receive requests at `http://localhost:8080`.

## Server Options

| Configuration         | Env Variable | Default        | Description     |
| :------------------   | :----------- | :------------- | :-------------  |
| \--from-file, -f      |  DEPUTY_FILE | mocks.yml      | Path to a YAML file containing defined mocks  |
| \--port, -p           |  DEPUTY_PORT | 8080           | The port the se |

## Initialize Mocks

When started, the server will look for a filed called `mocks.yaml` in the current working directory and will load all the behaviors defined in the file see the [Mock Definition](/guide).

an example `mocks.yaml` file looks like:

```yaml
- request:
    path: /hi
  response:
    body: Hello World
```

by just running

```shell
docker run \
-p 8080:8080 \
-v "${PWD}:/app/mocks/fixtures" \
--rm --name deputy \
 ghcr.io/sayjava/deputy
```

The server will auto load the behaviors in the file.

[Learn more about behaviors](/guide)

## Logging

The server uses the environmental variable `NODE_LOG_LEVEL` to enable logging. Possible values

-   `INFO`
-   `DEBUG`
-   `ERROR`


## Sample Setups
There are different ways to setup a dev environment with Deputy. Here are a few example

### A Simple NodeJS Application
```javascript
  const http = require('https')

  http.get('httsp')
```

```bash
curl -X GET app
```

<!-- ![NodeJS](./media/nodejs.svg) -->

### Docker Compose Environment
```yaml
version: '3'

services:
  deputy:
    image: sayjava/deputy:latest
    environment: 
      DEPUTY_PORT: 8080
    ports: 
      - 8080:8080
```
### Enable HTTPS


<!-- ## Programmatic

Behave can also be used as an express middleware in an existing application.

```javascript
const express = require('express');
const { behaveHandler } = require('@sayjava/behave');

const app = express();

app.get('/', (req, res) => res.render('index', { title: 'Hey', message: 'Hello there!' }));

app.use(behaveHandler({ config: { fromFile: 'behaviors.yaml' } }));

// can also be mounted on a path
app.use('/api', behaveHandler({ config: { fromFile: 'api.yaml' } }));

app.listen(3000, () => console.info(`App started on 3000`)); -->
```
