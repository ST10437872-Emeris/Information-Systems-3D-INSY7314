# Member 1 — Short Demo Script

## 1. Explain the structure

Open the `backend/src` folder in VS Code and show:

- `routes` — defines API endpoints.
- `controllers` — contains request-handling logic.
- `models` — represents user data and local storage.
- `middleware` — handles authentication, validation and errors.
- `config` — reads environment configuration.
- `utils` — reusable API response helpers.
- `app.js` — configures Express.
- `server.js` — starts HTTP/HTTPS server.

## 2. Run the project

From `backend`:

```powershell
npm install
npm run cert
npm run dev
```

Explain that the certificate is a local self-signed certificate used to demonstrate HTTPS for Part 1.

## 3. Show the health endpoint

Send:

```text
GET https://localhost:5000/api/health
```

Point out the standard response structure: `success`, `message`, and `data`.

## 4. Show registration and login

Register a valid user, then login. Explain that Part 1 uses temporary in-memory storage and that this will later be replaced by MongoDB.

## 5. Show one protected route

Copy the login token and send:

```text
GET https://localhost:5000/api/auth/me
Authorization: Bearer <token>
```

## 6. Show controlled validation

Send an invalid registration body and show that the API returns a 400 error with safe field-level messages rather than a stack trace.

## Recommended Member 1 wording

“I was responsible for establishing the Express backend architecture and organising the application into routes, controllers, models and middleware. I configured the project and server so that the rest of the team could build on a consistent, modular foundation.”
