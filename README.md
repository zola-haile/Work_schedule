# CareerNodejs — Shift & Task Management System

A web-based time management application for scheduling work shifts, assigning tasks, and managing team members. Built with Node.js and Express, it provides an admin-friendly dashboard with daily/weekly shift views, task tracking, and user account management.

---

## Features

- **Shift Scheduling** — Grid-based daily shift editor (6 days × 26 hours) and a weekly advanced shift view
- **Task Management** — Create, assign, edit, and mark tasks as done with due dates and reference links
- **User Management** — Add users with roles, view profiles, search by name, and update account info
- **Authentication** — Session-based login with bcrypt password hashing
- **Role System** — User roles (admin, sub_admin, ca, etc.) stored per account

---

## Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Runtime    | Node.js                              |
| Framework  | Express.js                           |
| Database   | MongoDB (local) via Mongoose         |
| Templating | EJS                                  |
| Styling    | Bootstrap 4 (CDN), custom CSS        |
| Auth       | express-session + bcrypt             |
| Frontend   | jQuery, Vanilla JS (AJAX)            |

---

## Project Structure

```
CareerNodejs/
├── app.js                          # App entry point, Express config
├── package.json
├── controllers/
│   ├── router.js                   # All route definitions
│   └── mongooseSchema/
│       ├── shifts.js               # Models + business logic
│       └── hours.js                # Hours schema
├── views/                          # EJS templates
│   ├── login.ejs
│   ├── nav.ejs
│   ├── admin_shift_tab.ejs         # Daily shift dashboard
│   ├── admin_tasks_tab.ejs         # Task dashboard
│   ├── admin_user_tab.ejs          # User management
│   ├── ashifts_tab.ejs             # Advanced/weekly shifts
│   └── user_info.ejs               # User profile page
└── public/assets/                  # Static files (CSS + client-side JS)
    ├── style.css
    ├── admin_shift_script.js
    ├── admin_task_script.js
    ├── admin_user_script.js
    ├── ashifts_script.js
    └── user_info_script.js
```

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB running locally on port `27017`

### Installation

```bash
git clone https://github.com/your-username/CareerNodejs.git
cd CareerNodejs
npm install
```

### Run

```bash
# Make sure MongoDB is running
mongod

# Start the server
node app.js
```

Open [http://localhost:3000/login](http://localhost:3000/login) in your browser.

---

## Environment Variables

The app uses `dotenv`. Create a `.env` file in the root:

```env
SESSION_SECRET=your_secret_here
MONGO_URI=mongodb://localhost:27017/career
PORT=3000
```

> Currently, the session secret and MongoDB URI are hardcoded in `app.js`. Moving them to `.env` is recommended before any production use.

---

## Routes Overview

| Method | Path                      | Description                        |
|--------|---------------------------|------------------------------------|
| GET    | `/login`                  | Login page                         |
| POST   | `/login`                  | Authenticate user                  |
| GET    | `/`                       | Daily shift grid                   |
| POST   | `/`                       | Update shift slot                  |
| GET    | `/tasks`                  | Task list                          |
| POST   | `/task1`                  | Create task                        |
| POST   | `/task/done`              | Mark task complete                 |
| POST   | `/edit_task`              | Edit task                          |
| GET    | `/user`                   | All users                          |
| GET    | `/user/:id`               | User profile                       |
| POST   | `/user/add_role`          | Create new user                    |
| POST   | `/user/update`            | Update user info                   |
| GET    | `/users/search`           | Search users by name               |
| GET    | `/ashift`                 | Advanced weekly shift view         |
| POST   | `/adding_employee_shift`  | Assign employee to shift           |
| POST   | `/remove_employee`        | Remove employee from shift         |

---

## Database Models

- **users** — `first_name`, `last_name`, `email`, `netid`, `role`, `password`
- **dayshifts** — `day`, `shift` (array of name pairs per hour)
- **task1** — `to`, `from`, `task_desc`, `due_by`, `posted_date`, `links`, `show`
- **advanced_shift** — `date`, `shifts` (map of shift name → employee array)
- **Hours** — `hours` (array of time slot labels)

---

## Author

Zola
