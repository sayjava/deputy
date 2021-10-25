---
home: true
heroImage: /assets/img/landing.svg
tagline: A robust HTTP mocking server that aids application development, inspection and testing
actionText: Get Started →
actionLink: /start/
features:
    - title: Develop
      details: Transparently mock non-ready/remote HTTP APIs with an easy declarative system
    - title: Proxy & Inspect
      details: Automatically proxy requests to remote servers. Developers can inspect and visualize network requests by application under test
    - title: Test
      details: Assert HTTP requests made from application under test using a RESTful API
footer: MIT Licensed
---

### Sample Environment

Selectively mock APIs, Deputy server will transparently forward unmatched requests to remote systems  
![media/dev_environment](./media/dev_environment.png)

### Quick Start

```bash
docker run -p 8080:8080 -p 8081:8081 ghcr.io/sayjava/deputy
```

```bash
$ curl http://localhost:8080/who-am-i
```

Visit the dashboard at `http://localhost:8081/dashboard`
