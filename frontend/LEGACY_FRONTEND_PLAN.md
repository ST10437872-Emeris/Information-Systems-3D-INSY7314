# HustleHub+ Frontend

## Secure Freelance Marketplace

The HustleHub+ frontend is the client-side component of the HustleHub+ freelance marketplace application. It is designed to provide users with an interface for interacting with the HustleHub+ backend API.

The overall HustleHub+ system follows the MERN architecture:

* **MongoDB** – Data storage
* **Express.js** – Backend API framework
* **React** – Frontend user interface
* **Node.js** – Backend runtime environment

The frontend communicates with the Node.js and Express backend through secure API requests.

---

# 1. Purpose

The purpose of the HustleHub+ frontend is to provide a user-friendly interface through which clients and freelancers can interact with the platform.

The frontend will provide interfaces for functionality such as:

* User registration
* User login
* Authentication
* Access to protected functionality
* User profile information
* Client functionality
* Freelancer functionality
* Communication with the backend API

The frontend is designed to work with the secure authentication and API infrastructure developed for the HustleHub+ backend.

---

# 2. Intended Users

HustleHub+ is designed for several types of users.

### Clients

Clients use the platform to:

* Register an account
* Log in securely
* Manage their profile
* Access freelance-related functionality
* Interact with freelance services

### Freelancers

Freelancers use the platform to:

* Register an account
* Log in securely
* Manage their profile
* Access freelance opportunities
* Interact with clients

### Administrators

Administrative functionality can be incorporated as the system develops.

Administrators may eventually be responsible for:

* Managing users
* Monitoring the platform
* Managing system information
* Managing security-related functionality

---

# 3. Frontend Architecture

The frontend forms the client-side layer of the MERN architecture.

```text
                    HUSTLEHUB+
                         │
                         ▼
                 ┌───────────────┐
                 │ Client / User │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ React         │
                 │ Frontend      │
                 │               │
                 │ Components    │
                 │ Pages         │
                 │ Services      │
                 └───────┬───────┘
                         │
                      HTTPS
                         │
                         ▼
                 ┌───────────────┐
                 │ Express API   │
                 │ Node.js       │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ Authentication│
                 │ Validation     │
                 │ Application    │
                 └───────────────┘
```

The React frontend does not directly access the database.

Instead, frontend requests are sent to the backend API. The backend is responsible for authentication, validation, application logic and data access.

---

# 4. Frontend Structure

As the React application is developed, the recommended structure is:

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Loading.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── ClientDashboard.jsx
│   │   └── FreelancerDashboard.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

This structure separates the user interface, pages, API communication, authentication state and routing.

---

# 5. Components

Reusable React components should be placed inside:

```text
src/components/
```

Examples include:

```text
Navbar.jsx
Footer.jsx
ProtectedRoute.jsx
Loading.jsx
```

Reusable components reduce duplicated code and make the application easier to maintain.

---

# 6. Pages

Application pages should be stored inside:

```text
src/pages/
```

The frontend is expected to include pages such as:

```text
Login
Register
Dashboard
Profile
```

Additional pages can be added as marketplace functionality is developed.

---

# 7. API Communication

The frontend communicates with the HustleHub+ backend through HTTP requests.

The backend API is currently available during local development at:

```text
https://localhost:5000
```

Authentication requests include:

```text
POST /api/auth/register
POST /api/auth/login
```

Protected requests include:

```text
GET /api/auth/me
GET /api/auth/profile
```

The frontend should communicate with these endpoints rather than accessing backend models or storage directly.

---

# 8. Authentication

The frontend works with the JWT authentication system provided by the backend.

The general authentication process is:

```text
User
 │
 ▼
React Login Page
 │
 ▼
POST /api/auth/login
 │
 ▼
Express Backend
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT
 │
 ▼
Return Authentication Response
 │
 ▼
React Frontend
 │
 ▼
Authenticated User
```

When a protected API request is made, the authentication token must be included in the request.

Example:

```text
Authorization: Bearer <JWT_TOKEN>
```

The backend remains responsible for validating the JWT.

The frontend must not assume that a user is authenticated simply because a token exists on the client.

---

# 9. Protected Routes

Protected frontend pages should only be accessible to authenticated users.

A protected route can follow this process:

```text
User requests protected page
          │
          ▼
     Authentication
       available?
       /        \
     No          Yes
     │            │
     ▼            ▼
 Login Page    Page Access
```

For example:

```text
/dashboard
/profile
```

can be protected from unauthenticated users.

The backend must continue to enforce authentication even when frontend routes are protected.

Frontend route protection is therefore an additional user-interface control and does not replace backend security.

---

# 10. Role-Based User Interfaces

HustleHub+ supports different user roles.

The frontend can provide different interfaces based on the authenticated user's role.

```text
                  Authenticated User
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
          Client                 Freelancer
             │                       │
             ▼                       ▼
      Client Dashboard       Freelancer Dashboard
```

For example:

### Client

```text
Client Dashboard
├── Profile
├── Projects
└── Marketplace
```

### Freelancer

```text
Freelancer Dashboard
├── Profile
├── Opportunities
└── Services
```

Role-based restrictions must also be enforced by the backend. The frontend should not be treated as the security boundary.

---

# 11. Frontend Security

Security is considered when designing the frontend.

Important frontend security principles include:

### HTTPS

The frontend communicates with the backend using HTTPS during local secure development.

### Authentication

Protected requests use the JWT provided by the backend.

### Input Validation

User input should be validated on the frontend to provide immediate feedback.

However, frontend validation does not replace backend validation.

The backend independently validates all incoming data.

### Sensitive Information

The frontend should not contain:

* JWT secrets
* Database credentials
* SSL private keys
* Backend environment secrets
* Other server-side credentials

These values belong on the backend.

---

# 12. Error Handling

The frontend should handle API errors without exposing technical information to users.

Examples include:

```text
400 Bad Request
Invalid input
```

```text
401 Unauthorized
Authentication required
```

```text
404 Not Found
Requested resource could not be found
```

```text
500 Internal Server Error
Something went wrong on the server
```

The backend is responsible for returning controlled error messages.

The frontend should display appropriate user-friendly messages based on the API response.

---

# 13. Frontend and Backend Relationship

The frontend and backend have separate responsibilities.

| Frontend               | Backend                    |
| ---------------------- | -------------------------- |
| User interface         | API                        |
| Forms                  | Input validation           |
| Navigation             | Authentication             |
| Display information    | JWT verification           |
| User interaction       | Authorisation              |
| Client-side validation | Server-side validation     |
| API requests           | Application logic          |
| Display errors         | Controlled error responses |

The backend remains the main security boundary because users can bypass client-side code.

---

# 14. Current Part 1 Scope

Part 1 primarily focuses on establishing the secure backend foundation of HustleHub+.

The current backend provides:

* User registration
* User login
* bcrypt password hashing
* JWT authentication
* Protected API endpoints
* Input validation
* HTTPS/SSL
* Error handling
* Security middleware

The frontend is intended to consume these backend services as the client-side portion of the MERN architecture.

Further frontend functionality can be implemented as the HustleHub+ project progresses.

---

# 15. Running the Frontend

Once the React frontend has been implemented, it can be started from the frontend directory.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The exact command may depend on the React tooling selected for the project.

The frontend should communicate with the backend API running at:

```text
https://localhost:5000
```

---

# 16. Development Guidelines

The following guidelines should be followed during frontend development:

1. Keep reusable components inside the `components` directory.
2. Keep application pages inside the `pages` directory.
3. Keep API communication inside the `services` directory.
4. Do not place backend secrets inside frontend code.
5. Do not store passwords in frontend source code.
6. Use HTTPS when communicating with the secure backend.
7. Do not rely exclusively on frontend validation.
8. Treat the backend as the final security boundary.
9. Keep authentication state organised through a dedicated authentication context or service.
10. Keep components modular and reusable.

---

# 17. Future Frontend Development

Future development of the HustleHub+ frontend can include:

* Complete React user interface
* Client dashboard
* Freelancer dashboard
* User profile management
* Project management
* Freelance service listings
* Search and filtering
* Application/bidding functionality
* Messaging
* Notifications
* Additional role-based functionality
* Integration with persistent MongoDB-backed services

These features will be implemented as the corresponding backend functionality becomes available.

---

# 18. Conclusion

The HustleHub+ frontend represents the client-facing layer of the MERN architecture.

React provides the user interface while the Node.js and Express backend provides the secure API. The frontend communicates with the backend through HTTPS and uses the backend authentication system to access protected resources.

Security remains primarily enforced by the backend through validation, bcrypt password hashing, JWT authentication, authorisation, HTTPS and controlled error handling.

This architecture allows the frontend to provide a user-friendly experience while maintaining a strong separation between the presentation layer and the secure application backend.
