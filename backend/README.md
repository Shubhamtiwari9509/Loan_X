# LoanX Backend Service

The core REST API backend for the LoanX platform, developed in Node.js, Express.js (ES Modules), and MongoDB / Mongoose.

## Architecture

- **Runtime**: Node.js v24+ (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (`jsonwebtoken`) with `bcryptjs` password hashing (12 rounds)
- **Input Validation**: `zod`
- **Security**: `helmet`, `cors`, `express-rate-limit`
- **ML Integration**: HTTP client communicating with Python FastAPI inference microservice (`http://127.0.0.1:8001`)

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Register new account (enforces `role='user'`).
- `POST /api/auth/login`: Authenticate and receive JWT token.
- `GET /api/auth/me`: Retrieve authenticated user profile.
- `PUT /api/auth/me`: Update profile fields.

### Predictions (`/api/predictions`) - Protected
- `POST /api/predictions`: Validates 18 loan features, calls Python ML service, stores prediction, returns decision & probability.
- `GET /api/predictions`: Paginated prediction history scoped strictly to the authenticated user.
- `GET /api/predictions/:id`: Retrieve single prediction record (restricted to owner or admin).

### Admin (`/api/admin`) - Protected (Admin only)
- `GET /api/admin/stats`: Platform overview KPIs, approval rate, averages, recent applications.
- `GET /api/admin/predictions`: Paginated list of all platform predictions with user details and filters.
- `GET /api/admin/users`: Paginated list of users with prediction counts.
- `PATCH /api/admin/users/:id/role`: Update user roles (with self-demotion prevention).

## Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run secure admin seed script
npm run seed:admin

# Run test suite
npm test
```
