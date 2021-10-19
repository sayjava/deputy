---
title: Quick Start
---

## Start Server

```shell
docker run -p 8080:8080 -p 8081:8081 sayjava/deputy
```

- This will start the server on port `8080` and ready to receive requests at [`http://localhost:8080`](`http://localhost:8080`)
- The dashboard will be accessible at [`http://localhost:8081`](`http://localhost:8081`)

## Server Options

| Configuration             | Env Variable | Default         | Description     |
| :----------------------   | :----------------------------- | :-------------  | :-------------  |
| \--mocks-directory, -d    |  DEPUTY_MOCKS_DIRECTORY        | mocks                             | Path to a folder containing yaml/json mock definition files |
| \--port, -p               |  DEPUTY_PORT | 8080            | The port the mock sever runs on   |  
| \--auto-proxy, -px        |  DEPUTY_AUTO_PROXY | true      | Auto proxy requests   |  

## Initialize Mocks

When started, the server scan the mocks folder in the current working directory and will load all the `.yml` or `.json` files. See the [Mock Definition](/guide).

an example `hello_world.yml` file looks like:  

<<< @/mocks/hello_world.yml

now the server can be started by mounting the current folder into the server directory

```shell
docker run \
-p 8080:8080 \
-p 8081:8081 \
-v "${PWD}:/app/mocks" sayjava/deputy
```

[Learn more about behaviors](/guide)


## Dashboard

Deputy starts a Dashboard and API on the mock server port + 1. i.e if the mock server is started on port `8080`, then the REST API and Dashboard are on `http://localhost:8081/dashboard` for the UI and `http://localhost:8081/api` for the REST APIs

### Logs

The UI list the requests received with the most recent at the top
![logs](./media/logs.png)

### Visualization

The requests can also be visualized by an auto-generated sequence diagram with support for services behind gateways

![Visualize](./media/visualize.png)

### Enable/Disable Mocks

Mocks can easily be created/deleted/edited/cloned from the UI and they can also be temporarily disabled

![disable](./media/disable_mocks.png)

## Logging

The server uses the environmental variable `NODE_LOG_LEVEL` to enable logging. Possible values

- `INFO`
- `DEBUG`
- `ERROR`

## Use case scenarios

There are different ways to setup a dev/test environment with Deputy. Here are a few examples

### As a standalone test/dev server

![media/test_environment](./media/test_environment.png)

```shell
docker run -p 8080:8080 -p 8081:8081 sayjava/deputy
```

This can also be used to just to inspect network calls made by the application

### Transparent Mix Of Mocks & Remote APIs (Docker Compose)

![media/dev_environment](./media/dev_environment.png)

Using deputy transparently with an application without modifying the code base
of the application. See the https://github.com/sayjava/deputy/tree/main/examples.

<<< @/examples/docker-compose.yml

## Enable HTTPS

If deputy detects a folder called `ssl` it's current directory, it will auto start in https mode.
The ssl folder must contain certification and key files named as:

- `key.pem`
- `cert.pem`

An example HTTPS server looks like this example.

<<< @/examples/docker-compose.secure.yml{11}

In this example, the deputy server will be available on https://localhost:8080

::: tip
The API and Dashboard endpoints are always running on http. i.e http://localhost/dashboard
:::
