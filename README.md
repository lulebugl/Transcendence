# ft_transcendence

A modern 3D Pong game built with microservices architecture.

* **Notion**: https://www.notion.so/lulebugl/Ft_transcendence-27b497c348318033bccdee1a5453f0de?source=copy_link

## Dev quickstart

Requirements: Node 20+, pnpm 9+, Docker 24+

Install deps and build apps:

```bash
pnpm install
pnpm -r build
```

Run locally with Docker (nginx on localhost:8080):

```bash
make build
make up
```

Endpoints:
- Frontend: `http://localhost:8080/`
- Backend health: `http://localhost:8080/api/health`

## ASSETS

- [https://images.squarespace-cdn.com/content/62d66fa29e72c560f8efc020/1cd27e3d-e6bc-4bfe-99bd-fae5365f4ae2/NozomiCitadel_Zipline_Before%281%29.png?content-type=image%2Fpng]
