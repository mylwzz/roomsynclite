# RoomSync‑Lite

A lightweight, peer‑to‑peer roommate‑matching web app built with Next.js.

---

## 🚀 Live Demo

https://roomsync-lite.vercel.app/

---

## Features

- **Email/Password Authentication** via Better Auth  
- **Profile Onboarding** with personal preferences  
- **Swipe‑style Matching**: Like or Pass on other users  
- **Mutual Matches** only appear in your Contacts page  
- **Admin Dashboard**: View, edit, delete all user profiles (admin role only)  
- **Responsive UI** with Tailwind CSS, shadcn/ui components, and Framer Motion animations  
- **Type‑safe DB** access using Drizzle ORM (Postgres‑JS) on both server and client  

---

## Tech Stack

- **Next.js** (app Router, Server & Client Components)  
- **Tailwind CSS** + **shadcn/ui** for design system  
- **Better Auth** for email/password auth & sessions  
- **Drizzle ORM (Postgres‑JS)** for type‑safe DB queries  
- **Neon (Postgres)** as managed, serverless database  
- **Framer Motion** for UI animations  

---

## Getting Started

### Prerequisites

- Node.js ≥16  
- A `.env` file in project root with:
  ```dotenv
  DATABASE_URL="your_postgres_connection_string"
  BETTER_AUTH_SECRET="a_strong_random_string"
  BETTER_AUTH_URL=http://localhost:3000