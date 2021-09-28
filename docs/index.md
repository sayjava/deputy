---
home: true
heroImage: /assets/img/landing.svg
tagline: A robust HTTP mocking server to rapidly aid application development and system testing
actionText: Get Started →
actionLink: /start/
features:
    - title: Develop
      details:  Simulate non-ready/remote APIs with an easy declarative system 
    - title: Inspect
      details: By proxying requests automatically, devs can inspect and visualize network requests by system under test
    - title: Test
      details: Assert HTTP requests made from system under test using a RESTful API
footer: MIT Licensed
---

## Quick Start
Create a file mock.yml
```yaml
- request:
    path: /hello
  response:
    statusCode: 200
    body:
      name: John Doe
      job: developer

```

```bash
npx @sayjava/behave 
```

<!-- or  -->

```bash
docker run -p 8080:8080 ghcr.io/sayjava/behave
```

```bash
$ curl http://localhost:8080/whoami
```