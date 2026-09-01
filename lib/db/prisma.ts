import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * METRONARY Server-Only Database Client Layer (Prisma 7 + PostgreSQL)
 *
 * Lifecycle & Safety Rules:
 * 1. DATABASE_URL is optional: if absent, returns `null` without throwing or opening sockets.
 * 2. In development, reuses a global singleton pool/client to avoid exhausting connections on hot reloads.
 * 3. Never exposed to client-side bundles.
 */

interface GlobalPrisma {
  prisma?: PrismaClient | null;
  pool?: pg.Pool | null;
}

const globalForPrisma = globalThis as unknown as GlobalPrisma;

export function getPrismaClient(): PrismaClient | null {
  const databaseUrl = process.env.DATABASE_URL;

  // If DATABASE_URL is intentionally not configured (e.g. static build or local dev without DB),
  // return null safely so data-access layers fall back to static seed data.
  if (!databaseUrl || databaseUrl.trim() === "") {
    return null;
  }

  // Reuse existing singleton in development
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  try {
    const pool = new pg.Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);
    const client = new PrismaClient({ adapter });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
      globalForPrisma.pool = pool;
    }

    return client;
  } catch (error) {
    // If connection setup fails when DATABASE_URL was provided, report error
    console.error("[METRONARY DB] Failed to initialize PostgreSQL client:", error);
    throw error;
  }
}

/**
 * Read-only accessor for checking database availability
 */
export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(url && url.trim().length > 0);
}
