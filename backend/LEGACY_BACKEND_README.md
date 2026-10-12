# HustleHub+ — Member 1 Backend & Database Architecture

This folder contains the **Member 1 deliverables** for HustleHub+, implementing a secure Node.js/Express backend with persistent MongoDB integration.

## Member 1 Contribution Summary

- **MongoDB Configuration & Mongoose Integration**: Connected Express to MongoDB with persistent schema models.
- **User Authentication**: User registration, login, bcrypt password hashing, and JWT creation with MongoDB storage.
- **Gig System CRUD API**: Full gig creation, retrieval, updates, and soft deletion with freelancer ownership checks.
- **Role-Based Authorization & Middleware**: Role verification middleware (`Client`, `Freelancer`, `Admin`) and JWT authentication middleware.
- **Bookings & Simulated Transactions API**: Client booking system with price locking, simulated transaction processing, rollback handling, and transaction history / income tracking for freelancers.
- **Security Middleware & Production Defaults**: Helmet security headers, CORS settings, body parser limits, and rate limiting.
- **Postman API Test Suite**: Postman collection for all routes and security/permission test cases.

---

## Backend Directory Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── config.js
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── gigController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── validationMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── gigModel.js
│   │   ├── bookingModel.js
│   │   └── transactionModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── gigRoutes.js
│   │   └── bookingRoutes.js
│   ├── utils/
│   │   └── apiResponse.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

---

## Running the Server

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/hustlehubplus
   JWT_SECRET=replace-with-a-long-random-secret
   JWT_EXPIRES_IN=1h
   NODE_ENV=development
   CLIENT_ORIGIN=http://localhost:5173
   ```

3. **Start MongoDB**:
   Ensure MongoDB service is running locally on port `27017` or update `MONGODB_URI`.

4. **Start the API**:
   ```bash
   npm run dev
   ```

   Output on success:
   ```text
   MongoDB connected
   HustleHub+ API running on http://localhost:5000
   ```

5. **Syntax & Health Check**:
   ```bash
   npm run check
   ```

---

## API Summary

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user (`Client` or `Freelancer`) |
| POST | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| GET | `/api/auth/me` | JWT | Get current user profile |

### Gig Routes (`/api/gigs`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/gigs` | Public | List all active gigs |
| GET | `/api/gigs/:id` | Public | Get single gig by ID |
| GET | `/api/gigs/mine/all` | Freelancer | Get all gigs created by authenticated freelancer |
| POST | `/api/gigs` | Freelancer | Create a new gig |
| PUT | `/api/gigs/:id` | Freelancer (Owner) | Update an existing gig owned by freelancer |
| DELETE | `/api/gigs/:id` | Freelancer (Owner) | Soft-delete a gig |

### Booking Routes (`/api/bookings`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/bookings` | Client | Book a gig and trigger simulated payment transaction |
| GET | `/api/bookings` | Authenticated | List bookings (Filtered for Client / Freelancer) |
| GET | `/api/bookings/transactions` | Authenticated | View transaction history & income summary |
