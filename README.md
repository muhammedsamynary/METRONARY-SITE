# METRONARY

High-concept streetwear storefront designed in Giza, Egypt. Built with Next.js App Router, Tailwind CSS, TypeScript, and Prisma ORM 7 + PostgreSQL.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Setup

### Current Development Fallback
Without a configured `DATABASE_URL`, the storefront automatically and seamlessly operates using verified local seed/fallback catalog data. No database instance is required to run, build, or preview the application.

### Real PostgreSQL Setup (Future Phase)
When connecting to a live PostgreSQL database:

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Set your valid PostgreSQL connection string in `.env`:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/metronary?schema=public"
   ```

3. Generate the Prisma Client:
   ```bash
   npm run db:generate
   ```

4. Apply database schema migrations:
   ```bash
   npm run db:migrate
   ```

5. Seed the database with verified deterministic catalog data:
   ```bash
   npm run db:seed
   ```

> **Note**: Migrations and database seeding have **not** been executed yet. The application currently runs safely on verified local catalog data.
