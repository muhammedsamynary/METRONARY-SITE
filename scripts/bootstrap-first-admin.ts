import "dotenv/config";
import { getPrismaClient } from "../lib/db/prisma";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function maskAuthUserId(id: string): string {
  if (id.length <= 12) return "***";
  return `${id.slice(0, 8)}...${id.slice(-4)}`;
}

async function bootstrapFirstAdmin() {
  console.log("=== METRONARY — First Super-Admin Bootstrap Utility ===");

  const authUserId = process.env.BOOTSTRAP_ADMIN_AUTH_USER_ID?.trim();
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim() || null;
  const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || null;

  // 1. Validate Auth User ID presence
  if (!authUserId) {
    console.error(
      "❌ Error: BOOTSTRAP_ADMIN_AUTH_USER_ID environment variable is required.\n" +
        "Please provide the Supabase Auth user UUID."
    );
    process.exit(1);
  }

  // 2. Validate UUID format
  if (!UUID_REGEX.test(authUserId)) {
    console.error(
      "❌ Error: BOOTSTRAP_ADMIN_AUTH_USER_ID is not a valid UUID format.\n" +
        "Expected format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
    );
    process.exit(1);
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    console.error("❌ Error: Database connection is not configured.");
    process.exit(1);
  }

  try {
    // 3. First-Admin Safety Check: Ensure no admins exist yet
    const existingCount = await prisma.adminAccess.count();
    if (existingCount > 0) {
      console.error(
        `❌ Bootstrap refused: administrator access already exists (${existingCount} admin record(s) found).\n` +
          "This utility is strictly for initializing the first SUPER_ADMIN account."
      );
      process.exit(1);
    }

    // 4. Duplicate Guard
    const existingMapping = await prisma.adminAccess.findUnique({
      where: { authUserId },
    });
    if (existingMapping) {
      console.error(
        `❌ Bootstrap refused: mapping for authUserId (${maskAuthUserId(
          authUserId
        )}) already exists.`
      );
      process.exit(1);
    }

    // 5. Create first SUPER_ADMIN record
    const created = await prisma.adminAccess.create({
      data: {
        authUserId,
        email,
        name,
        role: "SUPER_ADMIN",
        active: true,
      },
    });

    const newCount = await prisma.adminAccess.count();

    console.log("✅ First SUPER_ADMIN created successfully.");
    console.log(`- Auth User ID: ${maskAuthUserId(created.authUserId)}`);
    if (created.email) console.log(`- Email: ${created.email}`);
    if (created.name) console.log(`- Name: ${created.name}`);
    console.log(`- Role: ${created.role}`);
    console.log(`- Active: ${created.active}`);
    console.log(`- AdminAccess count: ${newCount}`);
  } catch (error) {
    console.error("❌ Unexpected database error during bootstrap:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

bootstrapFirstAdmin();
