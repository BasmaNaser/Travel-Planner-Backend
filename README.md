# Travel Planner Backend

Backend API for the Travel Planner application.

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer

## Features

- User Signup
- Email OTP Verification
- Resend OTP
- User Login
- Access Token
- Refresh Token
- Forget Password
- Reset Password

## Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/verify-otp` | Verify OTP |
| POST | `/auth/resend-otp` | Resend OTP |
| POST | `/auth/login` | Login user |
| POST | `/auth/refresh-token` | Generate new access token |
| POST | `/auth/forget-password` | Send reset password link |
| GET | `/auth/reset-password/:token` | Validate reset token |
| PATCH | `/auth/reset-password/:token` | Reset password |

## Installation

Clone the repository and install dependencies:

```bash
npm install