# Vishnu Sugesh | EmployeeHub

A clean, portfolio-ready Employee Management application built with the MERN stack.

> **Project status:** Starter implementation prepared for local development. Configure MongoDB, run the app, test the flows, then deploy and add your real links/screenshots before submission.

## Features

- Responsive employee dashboard with search and department filtering
- Create, view, edit, and delete employee records
- REST API using Express and Node.js
- MongoDB persistence with Mongoose
- Server-side validation and centralized error responses
- Environment-based configuration and CORS
- No credentials committed to source control

## Technology

- React + Vite
- Node.js + Express
- MongoDB Atlas + Mongoose
- Vanilla CSS with responsive layouts

## Project structure

```text
Vishnu_Sugesh_Employee_Management_MERN_Project/
├── client/                 # React UI
├── server/                 # Express API
├── .gitignore
└── README.md
```

## Requirements

- Node.js 18+ (a current LTS version is recommended)
- npm
- MongoDB Atlas cluster or local MongoDB instance

## Setup

### 1. Configure the backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and update values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:5173
```

Do not commit `.env`. Replace the placeholder URI with your own private connection string.

Start the API:

```bash
npm run dev
```

Health check: `http://localhost:5000/api/health`

### 2. Configure the frontend

Open a second terminal:

```bash
cd client
npm install
```

Create `client/.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the client:

```bash
npm run dev
```

Vite prints the local URL (normally `http://localhost:5173`).

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API status |
| GET | `/api/employees` | List employees; supports `?search=` and `?department=` |
| GET | `/api/employees/:id` | Fetch one employee |
| POST | `/api/employees` | Create an employee |
| PUT | `/api/employees/:id` | Update an employee |
| DELETE | `/api/employees/:id` | Delete an employee |

Required fields: `name`, `email`, `department`, `position`. Email addresses are unique. `status` can be `Active` or `On Leave`.

## Before publishing

- [ ] Run the client and server locally.
- [ ] Verify create, list, search/filter, edit, and delete flows.
- [ ] Add automated tests if required by your course.
- [ ] Configure production environment variables and CORS.
- [ ] Deploy frontend and backend, then replace the placeholder links below.
- [ ] Add real screenshots to `docs/screenshots/`.
- [ ] Make the GitHub repository public and verify it opens in a private/incognito browser.
- [ ] Never commit `.env`, secrets, or real personal data.

## Submission links

- **GitHub repository:** _Add your public repository URL_
- **Hosted application:** _Add your live frontend URL_
- **API URL:** _Add your live API URL_

## Screenshots

Place genuine screenshots of your running app in `docs/screenshots/`:
1. Dashboard
2. Add employee form
3. Edit employee form
4. Search/filter result
5. Validation or empty state
6. Mobile/responsive view

## Author

**Vishnu Sugesh**

Built as a full-stack MERN portfolio/academic project.
