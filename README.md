# MERN Book Catalog

Full-stack book catalog with a React frontend, Express API, and MongoDB. Docker Compose runs the whole stack.

## Requirements

- Git
- Docker and Docker Compose

## Clone and run with Docker

```bash
git clone https://github.com/KripsMansi/mernstack.git
cd mernstack
docker compose up --build
```

Then open [http://localhost:5173](http://localhost:5173).

The API is available at [http://localhost:5000](http://localhost:5000). MongoDB is exposed on port `27017`.

Stop the stack:

```bash
docker compose down
```

## Docker development (hot reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Or:

```bash
npm run docker:dev
```

## Local development without Docker

Install MongoDB locally, then:

```bash
cp server/.env.example server/.env
npm install
npm install --prefix server
npm install --prefix client
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)  
API: [http://localhost:5000](http://localhost:5000)

## Project layout

- `client/` — React (Vite) UI
- `server/` — Express API and MongoDB models
- `docker-compose.yml` — production-style containers
- `docker-compose.dev.yml` — development overlay
