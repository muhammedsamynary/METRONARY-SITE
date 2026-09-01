import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 Configuration for METRONARY
 *
 * Uses optional environment-based database configuration to ensure
 * `prisma generate` and `next build` succeed even when DATABASE_URL is not yet set.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "",
  },
});
