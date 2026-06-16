# CineVault — Movie Catalog App (S86)

A MEVN-stack movie catalog application built with Vue 3, Vite, Tailwind CSS, Pinia, and Vue Router.

## Tech Stack

- **Vue 3** (Composition API)
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Pinia** (state management)
- **Vue Router 4** (routing)
- **Axios** (HTTP client)

## API

Base URL: `https://movieapp-api-lms1.onrender.com`

Admin credentials: `admin@mail.com` / `admin123`

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/register` | Guest only | User registration |
| `/login` | Guest only | User login |
| `/movies` | Logged-in users | Browse movie catalog |
| `/movies/:id` | Logged-in users | Movie detail + comments |
| `/addMovie` | Admin only | Add a new movie |

## Features

- User registration & login with JWT authentication
- Movie catalog with search and genre filtering
- Movie detail view with all fields
- Comment system (stretch goal) with `id="addComment"`
- Admin dashboard to add movies
- Route guards (auth + admin)
- Fully responsive, dark cinematic UI
