import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 Configuration for METRONARY
 *
 * Direct URL is preferred for CLI operations / schema migrations,
 * with fallback to DATABASE_URL or empty string when unconfigured.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
});
