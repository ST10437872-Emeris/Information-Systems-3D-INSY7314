# HustleHub+ Security Design

## 1. Introduction

HustleHub+ is a secure freelance marketplace application designed to connect clients and freelancers. The security design for Part 1 focuses on establishing a secure backend foundation for user registration, authentication and protected API access.

The backend is developed using Node.js and Express. Security controls are implemented throughout the request-processing pipeline to protect user information, authentication credentials and API resources.

The main security mechanisms implemented in Part 1 are:

* HTTPS/SSL
* Input validation
* Input sanitisation
* Password hashing using bcrypt
* JSON Web Token (JWT) authentication
* Protected API routes
* Role-based authorisation support
* Centralised error handling
* Rate limiting
* HTTP security headers
* Request body size limits
* Environment-based configuration

---

# 2. Security Objectives

The security design aims to provide the following protections:

### Confidentiality

Sensitive information such as passwords and authentication secrets must not be exposed to users or stored in plaintext.

### Integrity

Incoming requests must be validated before being processed so that invalid or malicious data is rejected.

### Authentication

Users must prove their identity before accessing protected API functionality.

### Authorisation

The application must support controlling access according to the authenticated user's role.

### Secure Communication

Communication between the client and API should use HTTPS to protect information while it is transmitted.

### Controlled Error Handling

The API must not expose sensitive implementation details such as stack traces, server file paths, configuration values or secrets.

---

# 3. Security Architecture

The security controls form a layered security architecture.

```text
                    CLIENT / USER
                         │
                         ▼
                    HTTPS / SSL
                         │
                         ▼
              ┌─────────────────────┐
              │    Express API      │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Input Validation &  │
              │ Sanitisation        │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ JWT Authentication  │
              │ Middleware          │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Authorisation       │
              │ / Role Checks       │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Application Logic   │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ User/Data Storage   │
              └─────────────────────┘

                         │
                         ▼
              Controlled Error Handling
```

Each layer provides a different security control. This reduces the application's reliance on a single security mechanism.

---

# 4. Public and Protected Security Boundaries

The application separates endpoints into public and protected areas.

## 4.1 Public Endpoints

Registration and login are public because users must be able to create an account and authenticate.

```text
POST /api/auth/register
POST /api/auth/login
```

These endpoints do not require a JWT before the request is submitted.

However, they are still protected by input validation and authentication rate limiting.

---

## 4.2 Protected Endpoints

Protected endpoints require a valid JWT.

Examples include:

```text
GET /api/auth/me
GET /api/auth/profile
```

A protected request must contain:

```text
Authorization: Bearer <JWT>
```

The JWT authentication middleware validates the token before the request is allowed to continue.

If the token is missing or invalid, the API returns:

```text
401 Unauthorized
```

---

# 5. HTTPS and SSL

HTTPS is used to protect communication between clients and the backend API.

The local development server is configured to run using an SSL certificate.

The API is accessed using:

```text
https://localhost:5000
```

The project includes a certificate-generation script that creates localhost certificates for development.

Certificates can be generated using:

```bash
npm run cert
```

The server can then be started using:

```bash
npm run dev
```

HTTPS provides encrypted communication between the client and server and reduces the risk of sensitive authentication information being transmitted in plaintext.

Private certificate keys must not be committed to the public GitHub repository.

---

# 6. Password Security

Passwords are protected using bcrypt.

The application does not store passwords as plaintext.

During registration:

```text
User Password
      │
      ▼
     bcrypt
      │
      ▼
Password Hash
      │
      ▼
User Storage
```

During authentication, the supplied password is compared against the stored bcrypt hash.

The bcrypt work factor is configurable using:

```text
BCRYPT_ROUNDS
```

The Part 1 configuration uses:

```text
BCRYPT_ROUNDS=12
```

This provides a computationally expensive password hashing process that makes large-scale password guessing more difficult.

---

# 7. JWT Authentication

JSON Web Tokens are used to maintain authenticated API access.

After successful login, the backend generates a signed JWT.

The token contains information associated with the authenticated user, including:

* User ID
* Email
* Role
* Issuer
* Expiration information

The token is signed using the application's JWT secret.

A protected request is structured as:

```http
Authorization: Bearer <JWT_TOKEN>
```

The authentication middleware verifies the token before granting access to protected routes.

The verification process checks:

1. Whether a token was provided.
2. Whether the token has a valid structure.
3. Whether the signature is valid.
4. Whether the token has expired.
5. Whether the issuer is correct.
6. Whether the associated user still exists.

Invalid authentication results in:

```text
401 Unauthorized
```

---

# 8. Authorisation

Authentication determines **who the user is**.

Authorisation determines **what the authenticated user is allowed to access**.

HustleHub+ supports user roles such as:

```text
Client
Freelancer
```

The user's role is included within the authenticated JWT information.

The architecture therefore supports role-based access control for protected functionality.

For example:

```text
                Authenticated User
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          Client             Freelancer
             │                   │
             ▼                   ▼
       Client Features     Freelancer Features
```

Role-based restrictions can be applied to protected application functionality as additional features are developed.

---

# 9. Input Validation and Sanitisation

All user-provided data must be validated before being processed.

The backend uses `express-validator` for request validation.

Registration validation checks:

* Name type
* Name length
* Name characters
* Email format
* Password length
* Password complexity
* User role

The password must satisfy the required complexity rules, including:

* Lowercase character
* Uppercase character
* Number
* Special character
* Minimum length
* Maximum length

Login requests also validate the email and password fields.

Invalid input results in:

```text
400 Bad Request
```

The API returns controlled validation messages instead of allowing invalid data to reach the application logic.

---

# 10. Error Handling

HustleHub+ uses centralised error handling.

The error middleware prevents sensitive implementation information from being returned to API clients.

The application avoids exposing:

* Stack traces
* Server file paths
* Environment variables
* JWT secrets
* Internal configuration
* Sensitive server information

For example, an unexpected server error returns:

```json
{
  "success": false,
  "message": "An internal server error occurred."
}
```

Detailed error information can be logged on the server for debugging without exposing it to the client.

Unknown endpoints are also handled using a controlled response.

---

# 11. HTTP Security Headers

The backend uses Helmet to add security-related HTTP headers.

Helmet helps reduce exposure to several common web application risks by configuring appropriate HTTP response headers.

The Express `X-Powered-By` header is also disabled:

```javascript
app.disable('x-powered-by');
```

This reduces unnecessary disclosure of the backend technology being used.

---

# 12. CORS Protection

Cross-Origin Resource Sharing (CORS) is configured on the backend.

The application controls which origins can communicate with the API.

The configured frontend origin is provided through the environment configuration:

```text
CORS_ORIGIN
```

This allows the API's cross-origin policy to be configured without hard-coding deployment-specific values.

---

# 13. Rate Limiting

Authentication routes are protected using rate limiting.

This limits the number of requests that can be made to authentication endpoints within a defined period.

The purpose is to reduce the impact of:

* Repeated login attempts
* Automated authentication requests
* Basic brute-force attempts
* Excessive requests against authentication endpoints

The rate limiter is applied to the authentication routes.

---

# 14. Request Size Protection

The Express application limits JSON and URL-encoded request bodies to:

```text
20 KB
```

This prevents clients from submitting unnecessarily large request bodies and helps reduce resource-exhaustion risks.

Example configuration:

```text
20kb request limit
```

Requests exceeding the configured limit are rejected.

---

# 15. Environment and Secret Management

Sensitive configuration values are stored using environment variables rather than hard-coded directly into the source code.

Important configuration includes:

```text
JWT_SECRET
BCRYPT_ROUNDS
HTTPS_ENABLED
SSL_KEY_PATH
SSL_CERT_PATH
CORS_ORIGIN
```

A `.env.example` file is provided to show developers which configuration variables are required.

The actual `.env` file should never be committed to GitHub.

The JWT secret should also never be placed directly into source code.

---

# 16. Security Request Flow

A typical protected request follows this process:

```text
1. Client
      │
      ▼
2. HTTPS / SSL
      │
      ▼
3. Express receives request
      │
      ▼
4. Input validation
      │
      ▼
5. JWT authentication
      │
      ▼
6. Authorisation / role checks
      │
      ▼
7. Controller / application logic
      │
      ▼
8. Data storage
      │
      ▼
9. Controlled response
```

If a security check fails, processing stops and an appropriate error response is returned.

For example:

```text
Invalid Input
     │
     ▼
400 Bad Request
```

or:

```text
Missing/Invalid JWT
     │
     ▼
401 Unauthorized
```

---

# 17. Security Testing

Security functionality is tested using Postman.

The following scenarios are included in the testing process:

| Test                      | Expected Result           |
| ------------------------- | ------------------------- |
| Successful registration   | 201 Created               |
| Successful login          | 200 OK                    |
| Invalid login             | 401 Unauthorized          |
| Invalid registration data | 400 Bad Request           |
| Invalid email             | 400 Bad Request           |
| Weak password             | 400 Bad Request           |
| Missing JWT               | 401 Unauthorized          |
| Invalid JWT               | 401 Unauthorized          |
| Valid JWT                 | 200 OK                    |
| Unknown endpoint          | 404 Not Found             |
| HTTPS health request      | Successful HTTPS response |

These tests demonstrate that the application accepts valid requests while rejecting invalid or unauthorised requests.

---

# 18. Security Controls Summary

| Security Area          | Security Control       | Purpose                                  |
| ---------------------- | ---------------------- | ---------------------------------------- |
| Communication          | HTTPS/SSL              | Encrypt client-server communication      |
| Passwords              | bcrypt                 | Protect stored passwords                 |
| Authentication         | JWT                    | Authenticate API requests                |
| Authorisation          | User roles             | Support access control                   |
| Input                  | express-validator      | Reject invalid input                     |
| Errors                 | Centralised middleware | Prevent sensitive information disclosure |
| HTTP                   | Helmet                 | Add security headers                     |
| Requests               | Rate limiting          | Reduce excessive authentication requests |
| Request bodies         | 20 KB limit            | Limit oversized requests                 |
| CORS                   | Configured origins     | Control cross-origin requests            |
| Information disclosure | Disabled X-Powered-By  | Reduce technology disclosure             |
| Secrets                | Environment variables  | Protect configuration secrets            |

---

# 19. Security Boundary Diagram

The main security boundary can be represented as follows:

```text
                    PUBLIC ZONE
               ┌───────────────────┐
               │ Registration      │
               │ Login             │
               └─────────┬─────────┘
                         │
                         ▼
                    HTTPS / SSL
                         │
                         ▼
              ┌─────────────────────┐
              │ SECURITY BOUNDARY   │
              │                     │
              │ Validation          │
              │ JWT Authentication  │
              │ Authorisation       │
              │ Error Handling      │
              └──────────┬──────────┘
                         │
                         ▼
                  PROTECTED ZONE
              ┌─────────────────────┐
              │ Authenticated API   │
              │ Endpoints           │
              └──────────┬──────────┘
                         │
                         ▼
                  Application/Data
```

The security boundary ensures that protected application resources cannot be accessed without satisfying the required authentication and validation controls.

---

# 20. Part 1 Security Scope

Part 1 focuses on the secure backend foundation rather than the complete marketplace.

The security implementation therefore concentrates on:

* Secure registration
* Secure login
* Password hashing
* JWT authentication
* Protected API routes
* Input validation
* HTTPS
* Error handling
* Security headers
* Rate limiting
* Request limits
* Secure configuration

The security architecture is designed to support future HustleHub+ functionality, including persistent MongoDB storage and additional marketplace features.

---

# 21. Conclusion

The HustleHub+ security design uses a layered approach to protect the application.

HTTPS protects communication, input validation prevents invalid data from reaching application logic, bcrypt protects user passwords, JWT provides authenticated access to protected endpoints, and authorisation supports role-based access control.

Additional controls such as Helmet, CORS configuration, rate limiting, request-size restrictions and centralised error handling provide further protection.

Together, these controls establish a secure foundation for the HustleHub+ freelance marketplace and provide a structure that can be extended as additional functionality is implemented.
