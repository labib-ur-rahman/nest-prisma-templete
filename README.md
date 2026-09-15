# NestJS Prisma Boilerplate / Template

A production-ready backend boilerplate built with **NestJS**, **Prisma ORM**, and **Redis**. This template is designed with industry-standard architecture, focusing on security, scalability, and developer experience.

## 🚀 Features

- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Caching & State**: [Redis](https://redis.io/) (for Refresh Tokens, Rate Limiting, OTP tracking)
- **Authentication**:
  - JWT-based authentication (Access & Refresh tokens).
  - Stateful session management using Redis (Instant Logout).
  - OTP-based email verification with Brute-force protection.
  - Dynamic Bcrypt hashing.
- **Security**:
  - API Rate Limiting (`@nestjs/throttler` + Redis).
  - Environment variable validation (`class-validator` based).
  - Secure configurations.
- **Architecture**:
  - Clean modular structure (`modules`, `common`, `config`, `shared`).
  - Global Exception Filters & Response Interceptors.
  - Event Emitter for Audit Logs.
  - Swagger UI for API Documentation.

## 📦 Prerequisites

Before getting started, make sure you have the following installed:
- Node.js (v18+)
- PostgreSQL (or your preferred relational DB)
- Redis Server

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nest-prisma-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example env file and fill in your configurations:
   ```bash
   cp .env.example .env
   ```
   *Make sure your `DATABASE_URL` and `REDIS_URL` are correct.*

4. **Start Infrastructure (Docker)**
   If you have Docker installed, you can instantly spin up PostgreSQL and Redis without installing them on your local machine:
   ```bash
   docker-compose --profile dev up -d
   ```

5. **Database Configuration**
   Generate the Prisma client and sync the database schema:
   ```bash
   npx prisma generate
   npx prisma db push
   # or run: npx prisma migrate dev
   ```

6. **Run the Application**
   ```bash
   # development
   npm run start:dev

   # production mode
   npm run build
   npm run start:prod
   ```

## 📖 API Documentation

Once the server is running, the Swagger API documentation will be available at:
👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

## 🛡️ Authentication Flow

1. **Register**: User signs up. Account is set to `PENDING_VERIFICATION` and an OTP is sent via email.
2. **Verify OTP**: User submits the OTP. Account status changes to `ACTIVE`, and Access/Refresh tokens are returned.
3. **Login**: User logs in to receive Access and Refresh tokens. Refresh token is stored in Redis.
4. **Refresh Token**: Client uses the Refresh Token to get a new Access Token. It is validated securely against Redis.
5. **Logout**: Instantly invalidates the active Access Token and removes the Refresh Token from Redis.

## 📂 Project Structure

```text
.
├── prisma/             # Prisma ORM Configurations
│   ├── generated/      # Auto-generated Prisma Client
│   ├── migrations/     # Database migration history
│   ├── schema/         # Database models/schemas
│   └── seeds/          # Database seeding scripts
│
├── src/                # Application Source Code
│   ├── common/         # Global guards, filters, interceptors, constants, exceptions
│   ├── config/         # App configurations & Environment variable validation
│   ├── modules/        # Feature modules (e.g., Auth, User)
│   ├── shared/         # Shared infrastructure (Redis, Email, Throttler)
│   ├── prisma/         # Prisma NestJS module and service integration
│   └── main.ts         # Application entry point
│
├── docker-compose.yml  # Docker infrastructure config
└── .env.example        # Environment variables template
```
