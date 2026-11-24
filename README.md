# Inkwell — To-Do List (Spring Boot + Angular)

- `backend/` — Spring Boot 3 REST API (Java 17, Spring Web, Spring Data JPA, H2 database)
- `frontend/` — Angular 18 app (standalone components, signals, HttpClient)

## What you need installed

- **Java 17 or newer** (check with `java -version`)
- **Node.js 18.19+ or 20+** (check with `node -v`)

Maven is not needed: the backend includes the Maven wrapper (`mvnw`).

## 1. Start the backend (port 8080)

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

The API is now at http://localhost:8080/api/todos.
Tasks are saved in `backend/data/` and survive restarts.
You can browse the database at http://localhost:8080/h2-console

Run the backend tests with `./mvnw test`.

## 2. Start the frontend (port 4200)

In a second terminal:

```bash
cd frontend
npm install
npm start
```

Open http://localhost:4200. Requests to `/api` are forwarded to the backend
by `proxy.conf.json`.

## API

| Method | Path                          | What it does                               |
| ------ | ----------------------------- | ------------------------------------------ |
| GET    | `/api/todos?status=all`       | List tasks (`all`, `active`, `completed`)  |
| GET    | `/api/todos/{id}`             | Get one task                               |
| POST   | `/api/todos`                  | Create `{ "title": "Buy milk" }`           |
| PUT    | `/api/todos/{id}`             | Update `{ "title": "...", "completed": true }` |
| PATCH  | `/api/todos/{id}/toggle`      | Flip done / not done                       |
| DELETE | `/api/todos/{id}`             | Delete a task                              |
| DELETE | `/api/todos/completed`        | Delete all finished tasks                  |

Blank titles return `400`, unknown ids return `404`.

## Switching to MySQL or PostgreSQL

Add the driver dependency to `backend/pom.xml` and change the
`spring.datasource.*` lines in `backend/src/main/resources/application.properties`.
