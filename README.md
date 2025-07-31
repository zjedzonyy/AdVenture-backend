# 🎒 AdVenture — Fullstack App for Discovering Things to Do in Your Free Time

> There are things we know exist, but never truly consider doing ourselves.
> 
> 
> **AdVenture** is a curated collection of activities and experiences — from the well-known to the wonderfully obscure.
> 
> From DNA testing to polishing mud into shiny spheres (a real hobby in Japan), AdVenture helps you discover new ways to spend your free time — organized, accessible, and tailored to your interests.
> 

---

## 📦 Repositories & Demo

- 🔙 **Backend:** [adventure-backend](https://github.com/zjedzonyy/adventure-backend) ← *you are here*
- 🎨 **Frontend:** [adventure-frontend](https://github.com/zjedzonyy/adventure-frontend)
- 🔗 **Live Demo:** [at-adventure.netlify.app](https://at-adventure.netlify.app/)
  
> ⚠️ Most API endpoints require authentication. Example credentials are available in the demo app.
> 

---
## ✨ Core Features
- **User Authentication** — register, login, session management
- **Activity Discovery** — browse curated ideas and activities
- **Search & Filtering** — find activities by categories, duration, etc.
- **User Interactions** — like, comment, and rate activities
- **Social Features** — follow other users, see their activity
- **Content Management** — users can submit their own activity ideas
- **Pagination** — efficient browsing through large content sets
- **Image Uploads** — attach photos to activities and profiles

---

## 🧠 Project Overview

This backend was built first, starting with the API and a PostgreSQL schema.

- I used **Postman** during early iterations.
- Wrote **integration tests** using **Jest** and **Supertest**.
- Introduced **three project stages** — `dev`, `test`, and `prod` — each with isolated `.env` files and database flows.
- Created automation scripts for seeding, migrating, and resetting DBs across environments.
- Used **pgAdmin4** during development to explore and inspect the DB.
- Once the API was stable, I moved on to the frontend, occasionally revisiting the backend to refactor or improve DX.

---

## ⚙️ Backend Tech Stack

- **Node.js + Express** — RESTful API
- **PostgreSQL + Prisma ORM**
- **Passport.js + express-session** — session-based auth
- **Supabase** — image hosting
- **express-validator** — validation
- **Multer** — file uploads
- **Swagger** — API docs
- **Jest + Supertest** — testing
- **dotenv-flow** — multi-stage config
- **ESLint + Prettier** — linting & formatting

---
## 🧪 Available Scripts

All of that for 3 different stages: `dev`, `test`, and `prod`.

```
npm run start:server:dev       # Start development server
npm run test                   # Run tests in test environment
npm run migrate:dev            # Apply DB migrations (dev)
npm run seed:dev               # Seed sample dev data
npm run db:reset:dev           # Drop & recreate dev DB
```

Additional variants like :test and :prod are available for each script.
Example: npm run seed:test, npm run db:reset:prod, etc.

---

## 🚀 Deployment & Production Notes

Authentication is handled using **sessions** via `express-session` and `passport-local`. I chose this over JWT for its security advantages (e.g., built-in CSRF protection, no token storage on the client).

Production hosting:

- 🐘 **Railway** — PostgreSQL database and backend server
- 🌍 **Netlify** — React frontend
- 🗂️ **Supabase** — image storage (used for user-uploaded images)

### Things that broke in production:

1. **Network latency** — frontend (US), backend (EU) introduced delays & race conditions.
2. **Race conditions** — poor state handling led to inconsistent UX.
3. **React Dev Mode masking issues** — re-renders covered stale state problems.

As a result, I went through a full **refactor loop**, added loading states, fixed async flow bugs, and made the app more robust against production edge cases.

---

## 📁 Project Structure

```
backend/
├── controllers/       # Route logic
├── routes/            # Express routes
├── middlewares/       # Validation & auth guards
├── services/          # Business logic
├── database/          # Prisma setup & seed scripts
├── utils/             # Helper functions
└── swagger/           # Swagger config & docs
```

## 📚 API Documentation
- **Swagger UI:** [API-DOCS](https://strong-learning-production-8e89.up.railway.app/api-docs/)
Be patient, it just needs a moment to wake up :>
---

  
## 📬 Contact

Made by [@zjedzonyy](https://github.com/zjedzonyy)

