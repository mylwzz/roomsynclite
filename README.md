# RoomSync‑Lite

A lightweight, peer‑to‑peer roommate‑matching web app built with Next.js.

---

## Live Demo  🚀(wooosh)

https://roomsync-lite.vercel.app/

---

## Features

- **Email/Password Authentication** via Better Auth
- **Profile Onboarding** with personal preferences
- **Stylized Matching**: Like or Pass on other users
- **Mutual Matches** only appear in your Contacts page
- **Admin Dashboard**: View, edit, delete all user profiles (admin role only)
- **Responsive UI** with Tailwind CSS, shadcn/ui components, and Framer Motion animations
- **Type‑safe DB** access using Drizzle ORM (Postgres‑JS) on both server and client

---

## Tech Stack

- **Next.js** (App Router, Server & Client Components)
- **Tailwind CSS** + **shadcn/ui** for design system
- **Better Auth** for email/password auth & session management
- **Drizzle ORM (Postgres‑JS)** for type‑safe database queries
- **Neon (Postgres)** as managed, serverless database
- **Framer Motion** for UI animations

---

## Getting Started

### Prerequisites

- Node.js ≥16
- A PostgreSQL database (Neon, Supabase or local)
- pnpm (or npm / yarn)

### Installation

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/mylwzz/roomsynclite.git](https://github.com/mylwzz/roomsynclite.git)
    cd roomsynclite
    ```
2.  **Install dependencies**

    ```bash
    pnpm install
    # or
    npm install
    ```
3.  **Environment variables**

    Create a `.env.local` file in the project root with:

    ```ini
    DATABASE_URL="postgresql://<user>:<pass>@<host>:5432/<db>?sslmode=require"
    BETTER_AUTH_SECRET="<your_strong_random_hex_32>"
    BETTER_AUTH_URL="http://localhost:3000"
    ```
4.  **Database migrations**

    Drizzle‑Kit handles schema changes:

    ```bash
    # Generate a new migration
    npx drizzle-kit generate:pg \
        --schema src/lib/db/schema.ts \
        --out drizzle

    # Apply migrations
    npx drizzle-kit push:pg \
        --schema src/lib/db/schema.ts
    ```
5.  **Run the development server**

    ```bash
    pnpm dev
    # or
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view.

### Deployment

Deploy to Vercel in a few clicks:

1.  Push your code to GitHub.
2.  On Vercel, import your repository.
3.  In **Project Settings** → **Environment Variables**, add:
    - `DATABASE_URL`
    - `BETTER_AUTH_SECRET`
    - `BETTER_AUTH_URL`

    Vercel will automatically build and deploy.

## Project Structure

```bash
roomsync-lite/
├── app/
│   ├── api/             # Server API routes
│   │   ├── auth/        # Better-Auth handlers
│   │   ├── profile/route.ts  # GET/POST profile
│   │   ├── matches/route.ts  # GET mutual matches
│   │   ├── likes/         # POST like
│   │   ├── passes/        # POST pass
│   │   └── admin/         # Admin CRUD
│   ├── onboarding/      # Onboarding UI
│   ├── browse/          # Browse & match UI
│   ├── contacts/        # Contacts (mutual matches)
│   ├── page.tsx/        # Landing page
│   └── layout.tsx       # Global layout & Navbar
├── components/          # UI components
│   ├── auth/
│   ├── matches/
│   ├── layout/
│   ├── contacts/
│   └── ui/
├── lib/
│   ├── auth-client.ts   # Better-Auth React client
│   ├── auth.server.ts   # Server‑only auth helpers
│   ├── db.server.ts     # Drizzle client init
│   ├── db/schema.ts     # Drizzle schema definitions
│   ├── db/admin.ts      # Admin auth with db
│   ├── utils.ts         # Helpers (compatibility score, cn)
│   └── ...
├── drizzle/            # Drizzle‑Kit migrations
├── public/             # Static assets
├── tailwind.config.js  # Tailwind config
├── next.config.js      # Next.js config
├── vercel.json         # Vercel settings
└── README.md           # This file
```

## License
This project is licensed under the MIT License.