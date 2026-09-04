import "server-only";
import crypto from "node:crypto";

/**
 * Generates a unique, non-sequential customer-facing METRONARY order reference number.
 * Format: MET-XXXXXXXX (e.g., MET-4F9A2B1C)
 *
 * Characteristics:
 * - High entropy (32 bits of cryptographic randomness)
 * - Safe for customer receipts, SMS, and invoices
 * - No internal sequential DB IDs or timestamp leakages
 */
export function generateOrderNumber(): string {
  const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `MET-${randomHex}`;
}

/**
 * Generates a high-entropy, cryptographically secure 128-bit confirmation token.
 * Used exclusively for secret anonymous guest URL access: /order/{confirmationToken}
 * Never exposed as the customer-facing order reference number.
 */
export function generateConfirmationToken(): string {
  return crypto.randomBytes(16).toString("hex");
}
