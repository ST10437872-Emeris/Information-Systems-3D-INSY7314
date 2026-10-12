# HustleHubPlus — INSY7314 Part 2 / POE

> **Windows quick start:** First read [`START_HERE_WINDOWS.md`](START_HERE_WINDOWS.md). Double-click `01_SETUP_WINDOWS.bat` (once), then `02_START_BACKEND.bat` and `03_START_FRONTEND.bat`. Do not mix backend files with an older project folder.

**A full-stack MERN freelancer marketplace.** React + Vite, Express 5 / Node.js, MongoDB / Mongoose, JWT authentication, role-based access control, booking confirmation and **simulated** transaction recording. **No live payment service is connected.**

> **Assessment notice:** This project aims to address the assessment's Part 2 functional/security/testing requirements. No mark can be guaranteed. Dependencies and MongoDB were not available to run together in the preparation environment; run the commands, inspect the UI, capture genuine screenshots and confirm successful test results on your Windows PC before submitting. Previous screenshots inside `evidence/` and `Member1_Evidence/` are preserved from the supplied ZIP; they do **not** automatically verify the updated version.

## 1. Requirements

- Windows 10/11, **Node.js 20.19+** (Node 22 LTS recommended), npm, VS Code / Visual Studio with Node.js support.
- **MongoDB Community Server 8.0**, installed as a Windows service, and optional **MongoDB Compass**.
- Postman (free) to execute the included collection; `newman` for command-line API test reporting.
- Two Command Prompt/PowerShell terminals open; a GitHub repository and GitHub Desktop for version control.

Official downloads: https://nodejs.org/ · https://www.mongodb.com/try/download/community · https://www.mongodb.com/products/tools/compass · https://code.visualstudio.com/ · https://www.postman.com/downloads/

## 2. Windows setup, start to finish

1. **Extract** `HustleHubPlus_Part2_UPDATED_Windows.zip` into `Documents\GitHub\HustleHubPlus` or a regular folder. Open **HustleHubPlus** in VS Code (File > Open Folder). Avoid opening only `backend`.
2. Open a new PowerShell terminal. Confirm Node and npm: `node --version` and `npm --version`. Install/update Node 22 LTS if Node < 20.19.
3. Install **MongoDB Community Server** using the *Complete* installer. Tick **Install MongoDB as a Service** and optionally **Install MongoDB Compass**. MongoDB Compass is a GUI, not the database server.
4. Check `services.msc` and confirm **MongoDB Server** is **Running**. Otherwise open PowerShell **as Administrator** and run `net start MongoDB`. If the service doesn't exist, reinstall MongoDB and tick the service option.
5. Open MongoDB Compass; connect using `mongodb://127.0.0.1:27017`. Database `hustlehubplus` will appear once records are created. **Screenshot A:** Compass connected.
6. In terminal 1 navigate to `cd backend`.
7. Run `npm install` (generates new `package-lock.json` and downloads packages). Do not paste the terminal prompt itself. Do not use `npm audit fix --force` blindly because it can make breaking dependency upgrades.
8. Make your personal configuration file: `Copy-Item .env.example .env` (PowerShell) or `copy .env.example .env` (cmd).
9. Open `backend/.env`. Leave `MONGODB_URI=mongodb://127.0.0.1:27017/hustlehubplus`, `PORT=5000` and `CLIENT_ORIGIN=http://localhost:5173`. Replace `JWT_SECRET` with a **random, unique string of at least 32 characters**; don't commit `.env` or share your signing key. Generate in PowerShell:

   ```powershell
   -join ((1..48) | ForEach-Object { 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[(Get-Random -Maximum 62)] })
   ```

10. Run `npm run check`, then `npm run dev` in terminal 1. Expected: `MongoDB connected to hustlehubplus` followed by `API running: http://localhost:5000`. **Screenshot B:** terminal with both success messages (no secrets).
11. Open http://localhost:5000/api/health — expected `{"status":"ok","service":"HustleHubPlus API"}`. **Screenshot C:** health endpoint.
12. Open terminal 2, return to the **HustleHubPlus** root, run `cd frontend`, then `npm install`.
13. Copy the frontend config: `Copy-Item .env.example .env` (PowerShell) and verify it has `VITE_API_URL=http://localhost:5000/api`.
14. In terminal 2 run `npm run dev`. Open http://localhost:5173. **Screenshot D:** marketplace homepage.
15. Choose **Join free** and register as `Freelancer`. Use a real-looking but test-only email and a password with uppercase, lowercase, numeric and special characters. **Screenshot E:** registration page (no visible password).
16. Sign in as freelancer if needed. Open **My studio > Add a new gig**, fill all fields and publish. **Screenshot F:** gig form; **Screenshot G:** created gig visible in studio; **Screenshot H:** public listing.
17. Sign out; create a different account with the **Client** role. Browse the gig; click its arrow, confirm **simulated** booking (no payment integration). **Screenshot I:** booking confirmation and reference.
18. Open **My bookings**. **Screenshot J:** client booking history. Sign out and return to the freelancer account. Open **Orders & income**. **Screenshot K:** booking and simulated income totals.
19. In MongoDB Compass refresh database `hustlehubplus` and inspect collections `users`, `gigs`, `bookings` and `transactions`. **Screenshot L:** four collections; **Screenshot M:** linked booking & simulated transaction documents. Blur/hide password hashes, tokens, email addresses and other personal info in shared screenshots.
20. **Optional admin demonstration:** run the admin script in a **separate backend terminal** with a unique test-only email/password (see section 5), then log in at `/login`. **Screenshot N:** admin summary.
21. Run automated tests (`npm test` in each directory). **Screenshots O and P:** actual passing backend and frontend test outputs. Resolve all failed tests before submission.
22. Run the Postman collection and Newman commands in section 4. **Screenshot Q:** tests showing HTTP 401/403/400 and ownership enforcement. **Screenshot R:** genuine Newman result.
23. Record a short demo of registration → role difference → create gig → client booking → simulated transaction → income → testing. Confirm webcam/microphone requirements with lecturer. **Screenshot S:** video file visible in submission folder (do not paste or share live passwords).
24. Push *only* project code/docs/assets/tests to your GitHub repository. Do not commit `node_modules`, `.env`, personal tokens or database data. Include final URL in your academic submission.

**Troubleshooting:** `ECONNREFUSED 127.0.0.1:27017` = MongoDB not running / wrong URI. `JWT_SECRET` startup failure = `.env` missing or placeholder not replaced. `Failed to fetch` = backend not running / wrong `VITE_API_URL` / incorrect port. `EADDRINUSE :5000` = another process uses port 5000. `404 /api/...` = check route. A blank marketplace after successful startup simply means you haven't published any gigs. In PowerShell, use `Copy-Item`; in cmd, use `copy`.

## 3. Functionality and permissions

| Operation | Visitor | Client | Freelancer | Admin |
|---|:---:|:---:|:---:|:---:|
| Browse/list active gigs | Yes | Yes | Yes | Yes |
| Register/login | Yes | Yes | Yes | Login only |
| Create/update/delete **own** gig | No | No | Yes | No |
| View **own** gig dashboard | No | No | Yes | No |
| Create booking on active gig | No | Yes | No | No |
| View **own** bookings/transactions | No | Yes | Yes | No |
| View admin summary | No | No | No | Yes |

Routes: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`; `GET /api/gigs`, `GET /api/gigs/:id`, `GET /api/gigs/mine/all`, `POST/PUT/DELETE /api/gigs`; `POST /api/bookings`, `GET /api/bookings`, `GET /api/bookings/:id`, `GET /api/bookings/transactions`; `GET /api/admin/summary`.

Bookings snapshot the MongoDB gig price and create a `Transaction` record with `status: Simulated`. This is a class demonstration — there is no gateway and no banking information collection. On a basic standalone MongoDB install, the booking code uses **compensating cleanup** if the simulated transaction insert fails; it does not claim full multi-document database atomicity.

## 4. Automated testing and Postman/Newman

**Backend syntax and route tests:**

```powershell
cd backend
npm run check
npm test
```

These use Node's test runner, Supertest and mocked Mongoose methods for isolated API/authorization tests, so those specific tests don't require a live MongoDB instance. **Full integration tests still require a running database** and should be done with Postman/Newman and UI walkthroughs.

**Frontend UI/interaction tests:**

```powershell
cd frontend
npm test
npm run build
```

Vitest + React Testing Library cover rendering, filtering, protected routing and the login/registration screens. View the tests in `frontend/src/tests/App.test.jsx`.

**Postman/Newman:** Start MongoDB and backend. Import and run `postman/HustleHubPlus_Part2_Full.postman_collection.json` (22 sequenced requests). For a second run, edit the collection's `clientEmail` and `freelancerEmail` variables to new unique values. Initial registration returns `201`; existing accounts correctly return `409`.

From repository root:

```powershell
npm install -g newman
newman run .\postman\HustleHubPlus_Part2_Full.postman_collection.json --reporters cli,json --reporter-json-export .\evidence\newman-results.json
```

Newman works with the included Postman **collection v2.1**; it is not compatible with the newer Postman collection v3 format. Test output needs to be generated on your machine; **no report is pre-fabricated**. See `postman/NEWMAN_README.md`.

## 5. Admin account for RBAC demonstration (optional)

Open a fresh **PowerShell** terminal within `backend` while MongoDB is running. Set variables **for that terminal only** (do not write them in the repository):

```powershell
$env:ADMIN_EMAIL="admin.demo@example.test"
$env:ADMIN_PASSWORD="ReplaceMe!WithYourOwnStrongTestPassword2026"
npm run admin:create
Remove-Item Env:ADMIN_EMAIL
Remove-Item Env:ADMIN_PASSWORD
```

The script refuses existing admin emails or passwords shorter than 12 characters. Sign in to the React login screen with that admin account. Visitors can **never** self-register as admin.

## 6. Security controls

- Hashed and salted passwords with bcrypt; JWT issued with expiry, strict HS256 algorithm, issuer and per-request user lookup.
- Protected Express routes use **server-side** role checks, plus ownership restrictions in MongoDB queries (not merely hidden React buttons).
- `express-validator` request validation; Mongoose model validation; input size limit; escaped regex search and React text escaping.
- Helmet headers including strict API CSP (`default-src 'none'`); CORS allowlist by `CLIENT_ORIGIN`; no leaked stack traces in API error responses.
- Rate limits: 10 login attempts per 15 minutes and 20 booking requests per 15 minutes, **per IP** in development. Restart resets in-memory counters. Use a shared external store for production/multiple nodes.
- Signed JWT is held in **sessionStorage** (closed tab removes it); browser storage is not impervious to XSS. Use HttpOnly secure cookies and CSRF protection in production.
- API server runs HTTP on localhost for easier development; for any real deployment, enforce HTTPS using your web host's reverse proxy/TLS termination and production CSP adjustments.

## 7. Rubric-to-evidence checklist (Part 2 / 100 marks)

| Rubric criterion | Marks | Where implemented / what to show |
|---|---:|---|
| Application functionality | 20 | React `pages/`, `controllers/`, listing → booking → simulated transaction |
| RBAC enforcement | 15 | `authMiddleware`, `roleMiddleware`, owner-filter queries, Postman 401/403 |
| API security: JWT / validation / sanitisation | 15 | `authController`, `validationMiddleware`, models, `app.js` |
| Rate limiting | 10 | `app.js` on `/api/auth/login` and `/api/bookings`; repeat attempts to trigger 429 |
| Security headers (Helmet + CSP) | 10 | `app.js`; Postman response headers for `/api/health` |
| React frontend | 10 | Styled screens, form errors, loading/empty states, protected navigation |
| Backend testing (Postman + Newman) | 10 | `postman/*`, real Newman result + `backend/tests/api.test.js` |
| Frontend testing | 5 | `frontend/src/tests/`, real `npm test` output |
| README | 5 | This README with setup, security, routes, testing and sources |
| **Total** | **100** | Requirements addressed in the implementation; grading remains subject to verification. |

**Repository penalty:** The rubric deducts marks for missing/poor GitHub submission. Keep commit history from actual teamwork, clear messages, code contributions by multiple people, and a Markdown-formatted README. **Don't create fake contributor commits.**

## 8. Suggested GitHub Desktop commits

1. `feat(backend): validate and secure authentication with JWT and roles`
2. `feat(backend): enforce gig ownership and input validation`
3. `feat(backend): add booking and simulated transaction controls`
4. `feat(frontend): build responsive React marketplace and role dashboards`
5. `test: add backend route tests and React interactions`
6. `test(postman): add full Part 2 Newman collection`
7. `docs: document MongoDB setup security and demo evidence`

If changes are already in one uncommitted snapshot, don't invent old dates or misleading authors. Commit your authentic changes and coordinate the remaining team members to commit their own work.

## 9. Project layout

```
HustleHubPlus/
├─ backend/
│  ├─ src/{config,controllers,middleware,models,routes,utils}/
│  ├─ scripts/createAdmin.js
│  ├─ tests/api.test.js
│  ├─ .env.example
│  └─ package.json
├─ frontend/
│  ├─ src/{components,context,lib,pages,tests}/
│  ├─ src/styles.css
│  ├─ .env.example
│  └─ package.json
├─ postman/HustleHubPlus_Part2_Full.postman_collection.json
├─ docs/
├─ evidence/ (prior screenshots; add your new verified ones)
└─ README.md
```

## 10. Harvard-style Reference List

Express.js. s.a. *Error Handling*. [online] Available at: https://expressjs.com/en/guide/error-handling/ [Accessed 12 October 2026].

Express-validator. s.a. *Validation Chain API*. [online] Available at: https://express-validator.github.io/docs/api/validation-chain/ [Accessed 12 October 2026].

Helmet. s.a. *Helmet.js*. [online] Available at: https://helmetjs.github.io/ [Accessed 12 October 2026].

MDN Web Docs. s.a. *Using the Fetch API*. [online] Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch [Accessed 12 October 2026].

MongoDB. s.a. *Install MongoDB Community Edition on Windows*. [online] Available at: https://www.mongodb.com/docs/v8.0/tutorial/install-mongodb-on-windows/ [Accessed 12 October 2026].

Mongoose. s.a. *Validation*. [online] Available at: https://mongoosejs.com/docs/validation.html [Accessed 12 October 2026].

Node.js. s.a. *Test runner*. [online] Available at: https://nodejs.org/api/test.html [Accessed 12 October 2026].

OWASP Foundation. s.a. *Authorization Cheat Sheet*. [online] Available at: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html [Accessed 12 October 2026].

OWASP Foundation. s.a. *Password Storage Cheat Sheet*. [online] Available at: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html [Accessed 12 October 2026].

Postman. s.a. *Install and run Newman*. [online] Available at: https://learning.postman.com/docs/reference/newman-cli/installing-running-newman/ [Accessed 12 October 2026].

React. s.a. *useContext*. [online] Available at: https://react.dev/reference/react/useContext [Accessed 12 October 2026].

Testing Library. s.a. *React Testing Library*. [online] Available at: https://testing-library.com/docs/react-testing-library/intro/ [Accessed 12 October 2026].

---
**Original supplied contributions:** Existing `docs/`, older Postman files and pre-existing screenshots have been preserved to respect the team's work. They may reference an earlier API implementation. The current, canonical setup is **this README** and the `HustleHubPlus_Part2_Full.postman_collection.json` collection. Run tests after every significant change.
