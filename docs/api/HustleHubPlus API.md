HustleHubPlus API
1. System Overview
HustleHubPlus is a backend API designed to support a platform where users can register, authenticate and access protected services according to their roles. The system provides secure user authentication and applies several security controls to protect the API, user information and communication between the client and server.
The backend is responsible for receiving requests, validating input, authenticating users, applying security controls and returning appropriate responses.
The system uses:
•	Node.js and Express for the backend API
•	A database for storing user information
•	bcrypt for password hashing
•	JSON Web Tokens (JWT) for authentication
•	HTTPS for encrypted communication
•	Helmet for HTTP security headers
•	CORS for controlling cross-origin requests
•	Input validation for user-supplied data
•	Rate limiting to reduce repeated authentication attempts
•	Request-size limits to prevent unnecessarily large requests
•	Controlled error handling to avoid exposing sensitive internal information

2. System Architecture
The HustleHubPlus backend follows a layered API structure. A client such as Postman sends an HTTP request to the Express server. The server processes the request through the appropriate middleware and route, validates the supplied information and then performs the required operation.
A simplified architecture is:
Client / Postman
       │
       │ HTTPS Request
       ▼
Express Server
       │
       ├── Security Middleware
       │     ├── Helmet
       │     ├── CORS
       │     ├── Rate Limiting
       │     └── Request-Size Limits
       │
       ├── Validation
       │     ├── Name
       │     ├── Email
       │     ├── Password
       │     └── Role
       │
       ├── Authentication
       │     └── JWT Verification
       │
       ├── Routes / Controllers
       │
       ▼
Database
       │
       ▼
HTTP Response
This structure separates security, validation, authentication and application functionality. This makes the backend easier to understand, maintain and secure.

3. Request Flow
When a request is sent to the HustleHubPlus API, it passes through several stages.
Step 1: Client sends a request
The client sends an HTTP request to the backend API. HTTPS is used to protect the information transmitted between the client and server.
Step 2: Security middleware processes the request
Security middleware is applied before the request reaches the main application logic.
Helmet adds security-related HTTP headers, CORS controls cross-origin access, request-size limits restrict excessively large requests and rate limiting helps prevent repeated automated requests.
Step 3: Input validation
For requests that contain user information, the supplied data is validated.
The API checks information such as:
•	Name
•	Email address
•	Password
•	Role
•	Required fields
Invalid information is rejected before it is processed.
For example, an invalid email or unsupported role results in a 400 Bad Request response.
Step 4: Authentication
For protected endpoints, the API checks whether a valid JWT has been supplied.
If the request does not contain a valid token, access is denied and the API returns 401 Unauthorized.
Step 5: Application processing
If the request passes the required security and authentication checks, the backend processes the request and communicates with the database when necessary.
Step 6: Response
The server returns an appropriate HTTP response to the client.
Successful requests return appropriate success status codes, while invalid, unauthorised or unavailable requests return controlled error responses.

4. User Registration
The registration endpoint allows a new user to create an account.
POST /api/auth/register
The registration request contains the user's name, email, password and role.
Before creating the account, the API validates the supplied information.
For example:
•	The name must meet the validation requirements.
•	The email must have a valid format.
•	The password must meet the password requirements.
•	The role must be an accepted role.
•	Required fields must be present.
If validation fails, the API returns:
400 Bad Request
This prevents invalid data from being stored in the system.

5. Password Hashing with bcrypt
Passwords are not stored as plain text.
The application uses bcrypt to hash passwords before they are stored in the database.
The process can be represented as:
User enters password
        │
        ▼
Password validation
        │
        ▼
bcrypt hashing
        │
        ▼
Hashed password stored
        │
        ▼
Original password is not stored
The reason for using bcrypt is that passwords should not be stored in a form that can simply be read from the database.
When the user logs in, the submitted password is compared with the stored bcrypt hash. The application therefore verifies the password without needing to store the original password.
This provides an additional layer of protection if the database is exposed.

6. Login and Authentication
The login endpoint is:
POST /api/auth/login
The user provides their email address and password.
The authentication flow is:
User
 │
 │ Email + Password
 ▼
Login Endpoint
 │
 ▼
Validate Input
 │
 ▼
Find User
 │
 ▼
Compare Password with bcrypt hash
 │
 ├── Incorrect → 401 Unauthorized
 │
 └── Correct
       │
       ▼
    Generate JWT
       │
       ▼
Return JWT to Client
A successful login returns:
200 OK
An incorrect password returns:
401 Unauthorized
This ensures that incorrect credentials cannot be used to access the account.

7. JWT Authentication
HustleHubPlus uses JSON Web Tokens (JWTs) to authenticate users when they access protected endpoints.
After successful authentication, the server generates a JWT containing information needed to identify the authenticated user.
The client then sends the token with requests to protected endpoints using the Bearer authentication scheme.
For example:
Authorization: Bearer <JWT>
The authentication flow is:
Login
  │
  ▼
Credentials verified
  │
  ▼
JWT generated
  │
  ▼
Client receives token
  │
  ▼
Client sends token with protected request
  │
  ▼
Server verifies JWT
  │
  ├── Invalid → 401 Unauthorized
  │
  └── Valid → Request allowed
The JWT also has an expiry period. Token expiry is important because it limits the period during which a stolen or compromised token can be used.

8. Protected /me Endpoint
The /api/auth/me endpoint is protected by JWT authentication.
A request without a token receives:
401 Unauthorized
A request containing a valid JWT receives:
200 OK
This demonstrates that authentication is enforced at the protected route rather than simply relying on the user providing an email address or other identifying information.

9. Input Validation and Normalisation
Input validation is used to ensure that information supplied by users meets the application's requirements before it is processed.
The API validates:
Name
The name is checked to ensure that it meets the required validation rules.
Email
The email address is validated to ensure that it follows a valid email format.
Email information is also normalised so that equivalent email values are handled consistently.
Password
Passwords are checked against the application's password requirements, including the required length and character requirements.
Role
The role is validated against the roles supported by the application.
The supported roles include:
Client
Freelancer
Unsupported roles such as:
Admin
are rejected.
Missing fields
Requests that do not contain required information are rejected rather than being processed with incomplete data.
The purpose of validation is to ensure that the API only processes data that meets the application's requirements.

10. Error Handling
The API uses controlled error handling to prevent unnecessary internal information from being exposed to users.
For example, requesting an endpoint that does not exist returns:
404 Not Found
with a controlled message.
The API does not expose information such as:
•	Stack traces
•	Internal file paths
•	Sensitive server information
•	Internal Node.js error details
This is important because detailed internal errors could provide useful information to someone attempting to attack the application.

11. Helmet and Security Headers
The API uses Helmet to add security-related HTTP headers to responses.
Examples include:
X-Content-Type-Options
X-Frame-Options
Content-Security-Policy
Strict-Transport-Security
These headers provide additional protection against common web security risks.
The purpose of using Helmet is not simply to add headers, but to provide an additional security layer at the HTTP response level.

12. HTTPS
The HustleHubPlus API uses HTTPS:
https://localhost:5000
HTTPS encrypts communication between the client and server.
This is important because authentication requests can contain sensitive information such as login credentials and JWTs.
Without encrypted communication, information travelling between the client and server could potentially be intercepted.
HTTPS therefore protects the confidentiality and integrity of data while it is being transmitted.

13. CORS
The API uses Cross-Origin Resource Sharing (CORS) to control requests originating from different domains or origins.
CORS provides a controlled mechanism for allowing approved clients to communicate with the backend rather than allowing unrestricted cross-origin access.
This helps reduce unnecessary exposure of the API to unauthorised origins.

14. Rate Limiting
Authentication requests are protected by rate limiting.
The current configuration uses a 15-minute window with a maximum of 100 requests.
The purpose of rate limiting is to reduce the effectiveness of repeated automated requests, particularly against authentication endpoints.
For example, an attacker attempting many login requests could otherwise repeatedly attempt different passwords.
Rate limiting therefore provides an additional defence against automated authentication attacks.

15. Request-Size Limits
The API applies limits to the size of incoming JSON requests.
This prevents clients from sending unnecessarily large requests that could consume excessive server resources.
The purpose is to reduce the risk of resource exhaustion caused by unusually large requests.

16. Environment Variables and Secrets
Sensitive configuration values are stored using environment variables rather than being placed directly in the source code.
The JWT secret is therefore kept in the environment configuration.
The .env file is also excluded from version control.
This reduces the risk of accidentally exposing sensitive configuration through the source-code repository.

17. Security Testing
The security implementation was tested using Postman.
Test	Expected Result	Purpose
Invalid Registration	400 Bad Request	Tests input validation
Invalid Email	400 Bad Request	Tests email validation
Weak Password	400 Bad Request	Tests password requirements
Invalid Role	400 Bad Request	Tests role validation
Missing Fields	400 Bad Request	Tests required fields
Invalid JWT	401 Unauthorized	Tests JWT protection
404 Endpoint	404 Not Found	Tests controlled errors
Security Headers	Security headers returned	Tests Helmet
HTTPS Health	Successful HTTPS request	Tests encrypted communication
The authentication tests also demonstrated successful registration, successful login, rejection of incorrect passwords, rejection of requests without a JWT and successful access using a valid JWT.

18. Security Design Rationale
The security controls were selected because security should be implemented in multiple layers rather than relying on a single mechanism.
Security Decision	Why it was used
bcrypt	Prevents passwords from being stored as plain text
JWT	Provides stateless authentication for protected API requests
JWT expiry	Limits the period a compromised token can be used
Input validation	Prevents invalid data from being processed
Email normalisation	Ensures email values are handled consistently
Role validation	Prevents unsupported roles from being accepted
Helmet	Adds security-related HTTP headers
CORS	Controls cross-origin access
Rate limiting	Reduces repeated automated authentication attempts
Request-size limits	Reduces resource-exhaustion risks from oversized requests
HTTPS	Encrypts communication between client and server
Controlled errors	Prevents sensitive internal information from being exposed
Environment variables	Keeps sensitive configuration outside the source code
The main principle behind the security design is defence in depth. If one security control fails, additional controls still provide protection.

19. Overall Security Flow
The complete security approach can be summarised as:
                CLIENT
                  │
                  │ HTTPS
                  ▼
          ┌─────────────────┐
          │  Express API    │
          └────────┬────────┘
                   │
          Security Middleware
                   │
        ┌──────────┼───────────┐
        ▼          ▼           ▼
     Helmet      CORS      Rate Limit
        │          │           │
        └──────────┼───────────┘
                   ▼
             Input Validation
                   │
             ┌─────┴─────┐
             │           │
          Invalid       Valid
             │           │
             ▼           ▼
          400 Error   Authentication
                           │
                    ┌──────┴──────┐
                    │             │
                 No/Invalid      Valid
                    JWT           JWT
                     │             │
                     ▼             ▼
                  401 Error    API Access
                                   │
                                   ▼
                                Database
                                   │
                                   ▼
                                Response
This layered approach helps protect the API from invalid input, unauthorised access, insecure communication and unnecessary exposure of internal system information.

20. Conclusion
The HustleHubPlus API combines authentication, validation and multiple security controls to protect the system.
The authentication process uses bcrypt to protect passwords and JWTs to authenticate users accessing protected routes. Input validation ensures that invalid information is rejected before it reaches the application's core logic. HTTPS protects information during transmission, while Helmet, CORS, rate limiting and request-size limits provide additional security layers.
Controlled error handling also ensures that the API provides useful responses without unnecessarily revealing internal system information.
Together, these measures provide a layered security architecture rather than depending on a single security mechanism.

