# Member 1 — Part 1 Submission Checklist

## Core responsibility: Backend & API Foundation

- [x] Create the HustleHubPlus Node.js project.
- [x] Configure Express.
- [x] Create the server entry point.
- [x] Use a clean modular folder structure.
- [x] Configure environment variables.
- [x] Add API routes.
- [x] Add controllers.
- [x] Add an initial User model/data structure.
- [x] Add reusable API success/error response structure.
- [x] Add middleware locations for authentication, validation and errors.
- [x] Make the API runnable.
- [x] Add a health-check endpoint for quick proof that the API is running.
- [x] Add local HTTPS support.
- [x] Include Postman/REST Client requests for demonstrations.

## Evidence Member 1 should capture

1. VS Code Explorer showing the modular backend structure.
2. Terminal showing `npm install` completed.
3. Terminal showing `npm run cert` completed.
4. Terminal showing `npm run dev` and `https://localhost:5000`.
5. Postman/REST Client health-check success.
6. Successful registration request.
7. Successful login request returning a JWT.
8. Successful `/api/auth/me` request using a Bearer token.
9. Invalid registration request returning a controlled validation error.

## What Member 1 can say during the demo

“I established the backend foundation for HustleHubPlus using Node.js and Express. I separated concerns into routes, controllers, models and middleware, configured environment variables and server startup, added a temporary in-memory user model for Part 1, and standardised API responses. This structure allows the security and frontend components to integrate without creating tightly coupled code.”
