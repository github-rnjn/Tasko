# Tasko

Tasko is a full-stack task management application designed to help users organize, track, and manage their daily tasks efficiently.

The application provides authentication, email verification, password recovery, task management, categories, productivity statistics, profile management, avatar uploads, and a dashboard for tracking task progress.

## Features

### Authentication
- User registration
- Email verification using OTP
- Resend verification code
- Secure login
- JWT-based authentication
- Access token + refresh token architecture
- HTTP-only refresh token cookie
- Logout
- Forgot password
- Password reset using OTP
- Password hashing using bcrypt
- Session management

### Task Management
- Create, view, update, and archive tasks
- Task status: TODO, IN_PROGRESS, COMPLETED
- Task priority: LOW, MEDIUM, HIGH
- Due dates and completion tracking
- Categories and labels
- Estimated time
- Pagination, filtering, and search

### Categories
- Create, view, update, and delete categories
- Custom category colors
- Custom category icons

### Dashboard
- Total tasks
- Completed tasks
- Pending tasks
- Overdue tasks
- Productivity statistics
- Category-based task breakdown

### Profile
- View and update profile
- Change password
- Upload profile avatar
- Cloudinary image storage

### UI / UX
- Responsive layout
- Sidebar navigation
- Mobile navigation drawer
- Navbar
- Loading and error states
- Form validation
- Active navigation states
- Color-coded task statuses and priorities

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Tailwind CSS
- React Hook Form
- Zod
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer
- Cloudinary
- Multer
- Zod
- Helmet
- CORS
- Compression
- Morgan

## Architecture

Tasko follows a layered backend architecture:

```text
Client
   ↓
Routes
   ↓
Middleware
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
Models
   ↓
MongoDB
```

### Backend layers

- **Routes** — define API endpoints
- **Middleware** — authentication, validation, uploads, and error handling
- **Controllers** — handle HTTP requests and responses
- **Services** — contain business logic
- **Repositories** — handle database operations
- **Models** — define MongoDB/Mongoose schemas

## API Endpoints

Base URL:

```text
/api/v1
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register user |
| POST | `/auth/verify-email` | Verify email |
| POST | `/auth/resend-verification` | Resend verification OTP |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh-token` | Refresh access token |
| POST | `/auth/logout` | Logout |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/me` | Get current authenticated user |

### Categories

| Method | Endpoint | Description |
|---|---|---|
| POST | `/categories` | Create category |
| GET | `/categories` | Get categories |
| PATCH | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks` | Create task |
| GET | `/tasks` | Get tasks |
| GET | `/tasks/:id` | Get single task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Archive task |

### Profile

| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile` | Get profile |
| PATCH | `/profile` | Update profile |
| PATCH | `/profile/change-password` | Change password |
| PATCH | `/profile/avatar` | Upload avatar |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Get dashboard summary |

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Check API health |

## Authentication Flow

Tasko uses an access-token + refresh-token authentication architecture.

```text
Login
  ↓
Validate credentials
  ↓
Generate access token
  ↓
Generate refresh token
  ↓
Store hashed refresh token in Session
  ↓
Send access token to frontend
  ↓
Send refresh token using HTTP-only cookie
```

When the access token expires:

```text
Frontend request
      ↓
401 Unauthorized
      ↓
Refresh token request
      ↓
Validate refresh token
      ↓
Rotate refresh token
      ↓
Generate new access token
      ↓
Retry original request
```

## Email Verification Flow

```text
Register
   ↓
Create user
   ↓
Generate OTP
   ↓
Send OTP through SMTP
   ↓
User enters OTP
   ↓
Verify OTP
   ↓
isVerified = true
```

## Password Reset Flow

```text
Forgot Password
      ↓
Enter email
      ↓
Generate OTP
      ↓
Send OTP
      ↓
Enter OTP + new password
      ↓
Verify OTP
      ↓
Update password
      ↓
Clear refresh session/cookie
```

## Avatar Upload Flow

```text
User selects image
       ↓
FormData
       ↓
PATCH /profile/avatar
       ↓
Multer
       ↓
Cloudinary
       ↓
Cloudinary URL
       ↓
Save URL in User
       ↓
Return updated profile
```

## Environment Variables

### Backend

Create a `.env` file in the backend project:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=

SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=

CLIENT_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

For production:

```env
VITE_API_URL=https://your-backend-url/api/v1
```

Never commit `.env` files containing secrets to GitHub.

## Local Development

### Backend

```bash
cd tasko-backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

### Frontend

```bash
cd tasko-frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Production Deployment

The project can be deployed using:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Image storage: Cloudinary
- Email: SMTP provider

Production architecture:

```text
                 ┌────────────────────┐
                 │      Vercel        │
                 │   React Frontend   │
                 └─────────┬──────────┘
                           │
                           │ HTTPS
                           ▼
                 ┌────────────────────┐
                 │      Render        │
                 │ Node.js + Express  │
                 └──────┬───────┬─────┘
                        │       │
             ┌──────────┘       └──────────┐
             ▼                             ▼
      ┌──────────────┐              ┌─────────────┐
      │ MongoDB Atlas│              │  Cloudinary │
      └──────────────┘              └─────────────┘
                        │
                        ▼
                  SMTP Provider
```

## Security

The backend uses:

- Helmet
- CORS configuration
- HTTP-only refresh-token cookies
- JWT authentication
- Password hashing with bcrypt
- Hashed verification/reset tokens
- Request validation using Zod
- Authentication middleware
- Session-based refresh token management
- Environment variables for secrets
- MongoDB indexes
- Centralized error handling

## Error Handling

The backend uses centralized error handling and a common API response structure:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {},
  "timestamp": "2026-08-10T00:00:00.000Z"
}
```

## Future Improvements

Possible future improvements:

- Task reminders
- Push notifications
- Recurring tasks
- Drag-and-drop task management
- Dark mode
- Advanced analytics
- Task attachments
- Collaboration and sharing
- Real-time updates
- Calendar integration
- Progressive Web App support

## Author

**Peng**

## License

This project is currently intended as a personal/portfolio project.
