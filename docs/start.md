---
title: Quick Start
---

## Start Server

```shell
npx @sayjava/behave
```

This will start the sever on port `8080` and ready to receive requests at `http://localhost:8080`.

## Server Options

| Configuration         | Env Variable | Default      | Description                                                          |
| :------------------   | :----------- | :----------- | :------------- | :------------------------------------------------------------------- |
| \--from-file, -f      |  BEHAVE_FILE | behaviors.yaml | Path to a YAML file containing an array of behaviors               | BEHAVE_PORT
| \--port, -p           |  BEHAVE_HEALTH_CHECK        | 8080           | The port the sever should listen on                          BEHAVE_READY_CHECK        |
| \--healthCheck, -he   |              | /\_/healthz    | The keep-live path for the server                                    |
| \--readyCheck, -re    |              | /\_/readyz     | The ready path for the server                                        |
| \--https,  -s         |              | false          | Enable https. There must be an ssl folder with `key.pem` and `cert.pem` files present                           |

## Initialize Behaviors

When started, the server will look for a filed called `behaviors.yaml` in the current working directory and will load all the behaviors defined in the file see the [Behavior Document](/guide).

an example `behaviors.yaml` file looks like:

```yaml
- request:
    path: /hi
  response:
    body: Hello World

```

by just running

```shell
npx @sayjava/behave
```

The server will auto load the behaviors in the file.

[Learn more about behaviors](/guide)

## Logging

The server uses the environmental variable `NODE_LOG_LEVEL` to enable logging. Possible values

-   `INFO`
-   `DEBUG`
-   `ERROR`

## Programmatic

Behave can also be used as an express middleware in an existing application.

```javascript
const express = require('express');
const { behaveHandler } = require('@sayjava/behave');

const app = express();

app.get('/', (req, res) => res.render('index', { title: 'Hey', message: 'Hello there!' }));

app.use(behaveHandler({ config: { fromFile: 'behaviors.yaml' } }));

// can also be mounted on a path
app.use('/api', behaveHandler({ config: { fromFile: 'api.yaml' } }));

app.listen(3000, () => console.info(`App started on 3000`));
```
