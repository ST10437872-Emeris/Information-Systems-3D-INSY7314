Just a explation of the project 

For some reason i couldn't record my vioce when using the virtual machine so i hpe this helps


🎥 HustleHubPlus Video Demonstration Script

Recommended length: 5–7 minutes

Your main goal is to show the marker:

“I understand what I built, how it works, how it is secured, and that I tested it.”

Before You Start Recording

Open the following:

VS Code with HustleHubPlus-main open.
Postman
A browser if needed.
The VS Code terminal.

Go into your backend folder:

cd backend

Then run:

npm install
npm run cert
npm run dev

You should see something similar to:

HTTPS server running on https://localhost:5000

If you receive a certificate warning because you are using a local development certificate, that is okay.

⏱️ 0:00–0:30 — Introduction
What to show

Start with VS Code and show the HustleHubPlus project.

What to say

Hello, my name is [your name], and this is my demonstration of the HustleHubPlus system.

In this video, I will demonstrate the main functionality of the backend API, including user registration, login, JWT authentication, protected routes and input validation.

I will also demonstrate the security features that were implemented, including password hashing, HTTPS and error handling.

Finally, I will show some of the tests performed on the API.

Keep the introduction short. Don't spend too much time explaining the assignment.

⏱️ 0:30–1:10 — Project Structure
What to show

In VS Code, expand:

backend
└── src
    ├── config
    ├── controllers
    ├── middleware
    ├── models
    ├── routes
    ├── utils
    ├── app.js
    └── server.js

If you have them, briefly show:

docs
evidence
postman
README.md
What to say

The HustleHubPlus backend uses a modular architecture.

The routes define the available API endpoints, while the controllers contain the main application logic.

The models are responsible for working with user data.

The middleware handles functions such as authentication, validation and error handling.

The configuration files contain environment and application configuration.

The app.js file configures the Express application, while server.js is responsible for starting the server.

This separation of responsibilities makes the backend easier to maintain, test and extend.

⭐ Important

When explaining this, point at the folders as you talk about them.

You don't need to open every single file.

⏱️ 1:10–1:40 — HTTPS Security
What to show

Open:

backend/src/server.js

Scroll to where HTTPS is configured.

You can also show:

backend/certificates
⚠️ Don't show your private key contents.

If you have:

localhost-key.pem
localhost-cert.pem

do not open the private key and display its contents.

What to say

The backend is configured to use HTTPS instead of standard HTTP.

HTTPS encrypts communication between the client and the API while data is being transmitted.

This is particularly important for sensitive information such as login credentials and authentication tokens.

The certificate being used here is a local development certificate for testing the application.

⏱️ 1:40–2:00 — Start the Server
What to show

Go to the terminal.

Show:

npm run dev

and the server running.

What to say

The backend is now running on the local HTTPS server.

I can now use Postman to communicate with the API and test the different endpoints.

⏱️ 2:00–2:20 — Health Check
What to click

Open Postman.

Select your:

Health Check

request.

It should look similar to:

GET https://localhost:5000/api/health

Click:

Send

You should receive a successful response.

What to say

I will first test the health-check endpoint.

This endpoint is used to confirm that the backend API is running and responding correctly.

The successful response confirms that the server is available.

⏱️ 2:20–3:00 — User Registration

This is an important part of your demonstration.

What to click

In Postman, open:

Register

Use:

POST https://localhost:5000/api/auth/register

Example body:

{
  "name": "Demo User",
  "email": "demouser123@example.com",
  "password": "DemoPass123!",
  "role": "Client"
}

Then click:

Send

You want to show:

201 Created
What to say

I will now test the user registration endpoint.

The API receives the user's name, email, password and role.

Before the password is stored, it is hashed using bcrypt rather than being stored as plain text.

The registration request was successful and returned a 201 Created response.

This demonstrates that a new user can be successfully registered through the API.

⏱️ 3:00–3:30 — Demonstrate bcrypt

Now show the actual implementation.

What to open

Go to:

backend/src/controllers/authController.js

Find:

bcrypt.hash(...)

Then, if appropriate, show:

backend/src/models/userModel.js
What to say

The password is protected using bcrypt before it is stored.

This means that the original password is not stored directly in the database.

Instead, a password hash is stored.

The application also prevents the password hash from being included in the public user response.

This reduces the risk of exposing sensitive password information to the client.

⚠️ Don't spend too long here.

Show the code, explain it, and move on.

⏱️ 3:30–4:10 — Login and JWT

Go back to Postman.

Open:

Login

Use:

POST https://localhost:5000/api/auth/login

Body:

{
  "email": "demouser123@example.com",
  "password": "DemoPass123!"
}

Click:

Send

You should get:

200 OK

and a JWT.

What to say

I will now test the login endpoint using the credentials of the user I registered.

The application compares the supplied password with the stored bcrypt password hash.

If the credentials are correct, the API generates a JSON Web Token, also known as a JWT.

The JWT is then used to authenticate the user when accessing protected API endpoints.

The token also has an expiry time, which limits how long it can be used.

⏱️ 4:10–4:40 — Show JWT Implementation

Go back to:

backend/src/controllers/authController.js

Find the JWT creation code.

Show things such as:

expiresIn

and:

algorithm: 'HS256'

Then open:

backend/src/middleware/authMiddleware.js
What to say

The JWT is signed using a secret that is stored in the environment configuration rather than being hard-coded into the application.

The token has an expiry time and is signed using the configured algorithm.

The authentication middleware verifies the token before allowing access to protected endpoints.

This means that the API can identify whether a request is coming from an authenticated user.

⏱️ 4:40–5:15 — Protected Endpoint

Now demonstrate that authentication actually works.

What to click

In Postman:

Current User – Protected

Use:

GET https://localhost:5000/api/auth/me

Under:

Authorization

select:

Bearer Token

Paste the JWT from your login response.

Click:

Send

You should receive:

200 OK
What to say

I will now use the JWT to access a protected endpoint.

This endpoint requires the user to be authenticated.

I have supplied the valid JWT as a Bearer token.

The authentication middleware verifies the token, and because it is valid, the request is allowed to continue.

The API then returns the authenticated user's public information.

⏱️ 5:15–5:40 — Remove the JWT

This is very important.

You want to prove that the endpoint is actually protected.

What to do

In Postman:

Authorization → Bearer Token

Delete the token.

Then click:

Send

You should receive:

401 Unauthorized
What to say

I will now remove the JWT and send the exact same request again.

Because there is no valid authentication token, the request is rejected with a 401 Unauthorized response.

This demonstrates that authentication is actually being enforced on the protected endpoint.

⭐ That last sentence is worth saying clearly.

⏱️ 5:40–6:00 — Invalid JWT

Now test an invalid token.

For example:

abc123.invalid.token

Put it into:

Bearer Token

Click:

Send

You should receive:

401 Unauthorized
What to say

I will also test the endpoint using an invalid JWT.

The authentication middleware attempts to verify the token.

Because the token is invalid, the request is rejected and the API returns a 401 Unauthorized response.

This demonstrates that invalid authentication tokens cannot be used to access protected resources.

⏱️ 6:00–6:30 — Input Validation

Now demonstrate your validation.

Open your:

Invalid Registration request.

For example:

{
  "name": "A",
  "email": "wrong-email",
  "password": "123",
  "role": "Admin"
}

Click:

Send

You should get:

400 Bad Request

with validation errors.

What to say

The API also validates incoming data before processing the request.

For this test, I have provided invalid values such as an incorrect email address, an invalid password and an invalid role.

The API rejects the request with a 400 Bad Request response and provides validation messages explaining the problems.

This helps prevent invalid or unexpected data from being processed by the application.

⏱️ 6:30–6:50 — Error Handling

Go to:

backend/src/middleware/errorMiddleware.js
What to say

The backend also uses centralised error handling.

Instead of allowing errors to produce uncontrolled responses, the middleware handles errors consistently and returns appropriate HTTP status codes and messages.

This helps make the API more predictable and easier to troubleshoot.

⏱️ 6:50–7:00 — Conclusion

Finish by showing your project or Postman.

What to say

To conclude, the HustleHubPlus backend demonstrates a modular API architecture with HTTPS, bcrypt password hashing, JWT authentication, protected routes, input validation and centralised error handling.

I have also demonstrated successful and unsuccessful API requests to show that the security controls are actually being enforced.

This demonstrates the main functionality and security features implemented for the system.

Thank you.