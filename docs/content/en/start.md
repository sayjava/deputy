---
title: Start
menuTitle: Start
category: Getting Started
position: 2
features:
  - Start mock API server at http://localhost:8080
  - Dashboard and REST API server at http://localhost:8081
---

## Deputy Server

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

This command will:

<list :items="features"></list>

## Options

| Configuration            | Env Variable           | Default   | Description                                                 |
| :----------------------- | :--------------------- | :-------- | :---------------------------------------------------------- |
| \--mocks-directory, -d   | DEPUTY_MOCKS_DIRECTORY | mocks     | Path to a folder containing yaml/json mock definition files |
| \--port, -p              | DEPUTY_PORT            | 8080      | The port the mock sever runs on                             |
| \--api-port, -ap         | DEPUTY_API_PORT        | 8081      | The port the api sever runs on                              |
| \--auto-proxy, -px       | DEPUTY_AUTO_PROXY      | true      | Auto proxy requests                                         |
| \--tls-enabled, -tls     | DEPUTY_TLS_ENABLED     | undefined | Enables HTTPs and auto generates a self-signed certificate  |
| \--tls-domains, -domains | DEPUTY_TLS_DOMAINS     | undefined | Domain names that will be included in the certificate       |

## Initialize Mocks

When started, the server scan the `mocks` folder if present in the current working directory and will attempt to load all `.yml` or `.json` files in that folder. See the [Mock Definition](/guide).

an example `hello_world.json` file looks like:

```json
{
  "request": {
    "path": "/hello-word"
  },
  "response": {
    "status": 200,
    "body": "Hello"
  }
}
```

now the server can be started by mounting the current folder into the server directory

<code-group>
  <code-block label="NPM" active>

```bash
npx @sayjava/deputy@latest --mocks-directory=mocks
```

  </code-block>
  <code-block label="Docker">

```bash
docker run \
-p 8080:8080 \
-p 8081:8081 \
-v "${PWD}:/app/mocks" sayjava/deputy
```

  </code-block>
</code-group>

<!-- ## Use case scenarios

There are different ways to setup a dev/test environment with Deputy. Here are a few examples

### As a standalone test/dev server

![media/test_environment](./test_environment.png)

```shell
docker run -p 8080:8080 -p 8081:8081 sayjava/deputy
```

This can also be used to just to inspect network calls made by the application

### Transparent Mix Of Mocks & Remote APIs (Docker Compose)

![media/dev_environment](./media/dev_environment.png)

Using deputy transparently with an application without modifying the code base
of the application. See the https://github.com/sayjava/deputy/tree/main/examples.

<<< @/examples/docker-compose.yml -->

## HTTPS

Using the `--tls` flag will start the mock server in https mode at `https://localhost:8800`. Deputy server will auto generate a self signed certificate.

If Deputy detects a folder called `ssl` in the current directory, it will use certificates in that folder with the names:

- `key.pem`
- `cert.pem`
