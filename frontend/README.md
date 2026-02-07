# Evolution of Todo - Frontend (Phase II)

Next.js 14+ frontend for full-stack todo application with React and TypeScript.

## Tech Stack

- Next.js 14.0.4 (App Router)
- React 18+
- TypeScript 5.0+
- Tailwind CSS 3.4+ (utility-first CSS)

## Database

- API: Backend FastAPI at `http://localhost:8000/api`
- Auth: JWT-based authentication via localStorage

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with Header
│   │   ├── page.tsx          # Landing page (redirects)
│   │   ├── signup/
│   │   │   └── page.tsx      # Signup page
│   │   ├── signin/
│   │   │   └── page.tsx      # Signin page
│   │   └── todos/
│   │       ├── page.tsx      # Todos list page
│   │       ├── components/
│   │       │   ├── TodoList.tsx
│   │       │   ├── TodoItem.tsx
│   │       │   ├── CreateTodoForm.tsx
│   │       │   └── EmptyState.tsx
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx  # Edit todo page
│   ├── components/
│   │   ├── auth/
│   │   │   ├── SignupForm.tsx
│   │   │   └── SigninForm.tsx
│   │   ├── layout/
│   │   │   └── Header.tsx
│   └── lib/
│       └── api/
│           ├── auth.ts         # Auth API calls
│           └── todos.ts        # Todo API calls
├── public/                # Static assets
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── next.config.js            # Next.js config
└── Dockerfile               # Container definition
```

## Setup

### Prerequisites

1. Node.js 18+ installed
2. npm or yarn package manager

### Installation

```bash
npm install
```

### Environment Configuration

Create `.env.local` file in project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Running the Application

### Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Pages

### Authentication

- `/signup` - User registration page
- `/signin` - User login page
- `/` - Landing page (redirects to signin)

### Todos

- `/todos` - Main todos list page
  - View all todos
  - Create new todos
  - Toggle completion status
  - Edit todo (via detail page)
  - Delete todo

## API Integration

The frontend communicates with the backend API via `/lib/api` functions:

### Auth API

- `signup(email, password)` - Register new user
- `signin(email, password)` - Authenticate user
- `signout()` - Sign out user

### Todo API

- `getTodos()` - Fetch all todos for authenticated user
- `createTodo(title, description)` - Create new todo
- `getTodo(id)` - Fetch specific todo
- `updateTodo(id, title, description)` - Update todo
- `deleteTodo(id)` - Delete todo
- `toggleTodoComplete(id)` - Toggle completion status

## Authentication Flow

1. User signs up or signs in
2. JWT token stored in `localStorage` as `access_token`
3. Token sent in `Authorization` header as `Bearer {token}`
4. On signout, token removed from `localStorage`

## Features

### Implemented

- User registration with email and password
- User authentication with email and password
- Create todos with title and optional description
- View all todos with completion status
- Toggle todo completion status
- Edit todo title and description
- Delete todos with confirmation
- Responsive layout (mobile and desktop)
- Error handling and display
- Protected routes (redirect to signin if not authenticated)

### Responsive Design

- Mobile-first approach
- Breakpoints:
  - `sm` (640px)
  - `md` (768px)
  - `lg` (1024px)
- Touch-friendly buttons and inputs on mobile
- Hamburger menu on mobile, horizontal links on desktop

## Error Handling

- Validation errors displayed inline
- API errors displayed as toast/banner messages
- 404/401/403 errors trigger appropriate UI responses
- Network errors handled gracefully

## Docker

Build and run container:

```bash
docker build -t todo-frontend .
docker run -p 3000:3000 todo-frontend
```

## Deployment Notes

- Ensure `NEXT_PUBLIC_API_URL` is set to production backend URL
- Build production bundle: `npm run build`
- Start production server: `npm start`
