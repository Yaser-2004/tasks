## Full-Stack Dashboard App

A modern, responsive dashboard web application built with React + Vite, Node.js + Express, and MongoDB.
Includes JWT-based authentication, a tasks manager with CRUD operations, and a user profile with logout functionality.

## Features

1. Authentication

- Login / Signup with JWT

- Protected routes (dashboard accessible only when logged in)

2. Tasks Manager

- Create / Read / Update / Delete (CRUD) tasks

- Mark tasks as completed (moves to bottom, green background)

- Filter tasks by All / Finished / Not Finished

- Search tasks by title or description

- Responsive task cards UI

## User Profile

- Fetch current user’s details (name, email)

- Logout with one click

## Responsive Design

- Collapsible sidebar (mobile-friendly with hamburger menu)

- Smooth transitions and professional UI with TailwindCSS

## Tech Stack
1. Frontend

- React (Vite)

- TailwindCSS

- Axios

- React Router DOM

2. Backend

- Node.js + Express

- MongoDB + Mongoose

- JWT Authentication

- Bcrypt for password hashing

## Project Structure

├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   └── App.jsx
│   └── index.html
│
└── README.md


## Future Improvements

- Dark Mode toggle 

- Task priorities (Low, Medium, High)

- Profile editing & avatar upload

- Notifications for task deadlines