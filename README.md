# TaskFlow — Frontend

The client-side application for **TaskFlow**, a task management web app built with the MERN stack. This React SPA handles authentication, personal task CRUD, project management, and a user profile — all styled with a classic, editorial UI using Tailwind CSS.

> **Related:** See [`server README.md file`](https://github.com/Chirag743/Task-Management-Server/blob/main/README.md) for the Express API, data models, and endpoint documentation.

---

## Tech Stack

| Layer       | Technology                           |
| ----------- | ------------------------------------ |
| Framework   | React 19                             |
| Build tool  | Vite 8                               |
| Routing     | React Router 7                       |
| Styling     | Tailwind CSS 4                       |
| HTTP client | Axios                                |
| Auth        | Cookie-based JWT (`withCredentials`) |

---

## Features

### Public

- **Home** — Landing page with product overview and sign-up CTAs
- **Login / Sign up** — Account access with inline error handling

### Dashboard (authenticated)

- **Overview** — Summary stats, recent tasks, and recent projects
- **Tasks** — Create, edit, delete, search, and filter personal tasks by status
- **Projects** — Manage projects and nested project tasks (expand/collapse per project)
- **Profile** — View and update name and email

### UX & behaviour

- Session guard on dashboard routes (redirects to login if unauthenticated)
- Sign out clears the server cookie and returns to login
- Loading states and empty states across data views
- Responsive layouts for mobile and desktop

---

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running (default: `http://localhost:8000`)

### Install & run

```bash
cd client
npm install
npm run dev
```

The app runs at **http://localhost:5173** by default.

### Other scripts

```bash
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

---

## Full Stack Setup

Run the frontend and backend together for local development:

```bash
# Terminal 1 — API
cd server
npm install
npm run dev          # http://localhost:8000

# Terminal 2 — Client
cd client
npm install
npm run dev          # http://localhost:5173
```

The server needs a `.env` file with `MONGO_URI` and `JWT_SECRET` — see [`../server/README.md`](../server/README.md#environment-variables).

---

## Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and icons
│   ├── layouts/
│   │   ├── AppLayout.jsx       # Public shell (header + main)
│   │   └── DashboardLayout.jsx # Authenticated shell (sidebar + main)
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   └── dashboard/
│   │       ├── DashboardHomePage.jsx
│   │       ├── DashboardTasksPage.jsx
│   │       ├── DashboardProjectsPage.jsx
│   │       └── DashboardProfilePage.jsx
│   ├── utils/
│   │   ├── api.js              # Axios instance (base URL + credentials)
│   │   └── tailwindClasses.js  # Shared Tailwind class strings
│   ├── App.jsx             # Route definitions
│   ├── main.jsx            # React entry point
│   └── index.css           # Tailwind import + design tokens
├── index.html
├── vite.config.js
└── package.json
```

---

## Routing

Routes are defined in `src/App.jsx` using `createBrowserRouter`.

| Path                    | Page     | Layout          | Auth     |
| ----------------------- | -------- | --------------- | -------- |
| `/`                     | Home     | AppLayout       | Public   |
| `/login`                | Login    | AppLayout       | Public   |
| `/signup`               | Sign up  | AppLayout       | Public   |
| `/dashboard`            | Overview | DashboardLayout | Required |
| `/dashboard/tasks`      | Tasks    | DashboardLayout | Required |
| `/dashboard/projects`   | Projects | DashboardLayout | Required |
| `/dashboard/my-profile` | Profile  | DashboardLayout | Required |

`DashboardLayout` verifies the session on mount by calling `GET /api/user/profile`. If the request fails, the user is redirected to `/login`.

---

## API Integration

All HTTP requests go through a single Axios instance in `src/utils/api.js`:

```js
const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://deployed-url.com/"
    : "http://localhost:8000/",
  withCredentials: true,
});
```

`withCredentials: true` sends the httpOnly `jwt` cookie set by the backend on login.

### Endpoints consumed

These map directly to the backend routes documented in [`../server/README.md`](../server/README.md#api-reference).

| Method   | Endpoint                               | Used in             |
| -------- | -------------------------------------- | ------------------- |
| `POST`   | `/api/user/signup`                     | Sign up             |
| `POST`   | `/api/user/login`                      | Login               |
| `POST`   | `/api/user/logout`                     | Sign out            |
| `GET`    | `/api/user/profile`                    | Profile, auth guard |
| `PUT`    | `/api/user/profile`                    | Profile update      |
| `GET`    | `/api/task`                            | Tasks, dashboard    |
| `GET`    | `/api/task?status={status}`            | Task status filter  |
| `POST`   | `/api/task`                            | Create task         |
| `PUT`    | `/api/task/:taskId`                    | Update task         |
| `DELETE` | `/api/task/:taskId`                    | Delete task         |
| `GET`    | `/api/project`                         | Projects, dashboard |
| `POST`   | `/api/project`                         | Create project      |
| `PUT`    | `/api/project/:projectId`              | Update project      |
| `DELETE` | `/api/project/:projectId`              | Delete project      |
| `POST`   | `/api/project/:projectId/task`         | Add project task    |
| `PUT`    | `/api/project/:projectId/task/:taskId` | Update project task |
| `DELETE` | `/api/project/:projectId/task/:taskId` | Delete project task |

**Status filter values:** `pending`, `in-progress`, `completed`

**Task body fields:** `title`, `description`, `status`

---

## Styling

The UI uses **Tailwind CSS v4** with a small custom theme in `src/index.css`.

### Design tokens (`@theme`)

| Token                                              | Purpose                       |
| -------------------------------------------------- | ----------------------------- |
| `paper`, `paper-dark`                              | Warm background tones         |
| `ink`, `ink-muted`, `ink-faint`                    | Text hierarchy                |
| `rule`, `rule-light`                               | Borders and dividers          |
| `surface`                                          | Panel/card background         |
| `accent`                                           | Primary actions (olive green) |
| `danger`                                           | Destructive actions           |
| `status-pending`, `status-progress`, `status-done` | Task status badges            |

### Typography

- **Headings** — Source Serif 4 (`font-serif`)
- **UI / body** — DM Sans (`font-sans`)

Fonts are loaded in `index.html` via Google Fonts.

### Shared classes

Repeated Tailwind combinations (buttons, inputs, panels, tables) live in `src/utils/tailwindClasses.js` as exported strings — for example `btnPrimary`, `inputClass`, `panel`. Pages import and apply these directly to native HTML elements.

---

## Deployment

1. Update the production API URL in `src/utils/api.js`:

```js
baseURL: import.meta.env.PROD
  ? "https://your-api-domain.com/"
  : "http://localhost:8000/";
```

2. Build and deploy the `dist/` folder:

```bash
npm run build
```

3. Ensure the backend is deployed with `NODE_ENV=production`, HTTPS, and CORS configured for your frontend origin with `credentials: true`.

---

## Related

This frontend is the **client** half of the TaskFlow MERN app. It expects the Express + MongoDB API in the sibling [`server`](https://github.com/Chirag743/Task-Management-Server) directory.

|             | Client                | Server                                                                                 |
| ----------- | --------------------- | -------------------------------------------------------------------------------------- |
| Default URL | http://localhost:5173 | http://localhost:8000                                                                  |
| README      | This file             | [`README.md`](https://github.com/Chirag743/Task-Management-Server/blob/main/README.md) |
