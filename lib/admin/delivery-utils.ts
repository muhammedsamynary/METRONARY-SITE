/**
 * Utility functions for Delivery Zone Key Normalization and Minor-Unit Currency Parsing
 */

/**
 * Normalizes a delivery area / zone key for deterministic matching.
 * Examples:
 * - "  Cairo  " -> "cairo"
 * - "New Cairo" -> "new-cairo"
 * - "6th of October / Giza" -> "6th-of-october-giza"
 */
export function normalizeDeliveryKey(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
    .replace(/-{2,}/g, "-"); // collapse consecutive hyphens
}

export interface ParseFeeResult {
  valid: boolean;
  feeMinor?: number;
  error?: string;
}

/**
 * Deterministically parses an EGP currency input string into integer minor units (piastres).
 * Avoids JavaScript floating-point rounding issues.
 * Examples:
 * - "75" -> 7500
 * - "75.5" -> 7550
 * - "75.50" -> 7550
 * - "0" -> invalid (must be > 0)
 * - "-5" -> invalid
 * - "abc" -> invalid
 * - "75.555" -> invalid (> 2 decimals)
 */
export function parseDeliveryFeeEgp(input: string | number): ParseFeeResult {
  if (input === null || input === undefined) {
    return { valid: false, error: "Delivery fee is required." };
  }

  const str = String(input).trim();
  if (!str) {
    return { valid: false, error: "Delivery fee is required." };
  }

  // Strictly match positive decimal or integer pattern: e.g. "75", "75.5", "75.50"
  const regex = /^\d+(\.\d{1,2})?$/;
  if (!regex.test(str)) {
    return {
      valid: false,
      error: "Fee must be a valid positive amount in EGP with up to 2 decimal places (e.g. 75 or 75.50).",
    };
  }

  const parts = str.split(".");
  const poundsPart = parseInt(parts[0], 10);
  let piastresPart = 0;

  if (parts.length === 2) {
    const rawDec = parts[1];
    if (rawDec.length === 1) {
      piastresPart = parseInt(rawDec, 10) * 10;
    } else if (rawDec.length === 2) {
      piastresPart = parseInt(rawDec, 10);
    }
  }

  const feeMinor = poundsPart * 100 + piastresPart;

  if (feeMinor <= 0) {
    return { valid: false, error: "Delivery fee must be greater than 0 EGP." };
  }

  if (feeMinor > 1000000) {
    // max 10,000 EGP sanity limit
    return { valid: false, error: "Delivery fee exceeds maximum allowed limit (10,000 EGP)." };
  }

  return { valid: true, feeMinor };
}

/**
 * Formats minor currency integer to clean human-readable EGP string
 * Examples:
 * - 7500 -> "75 EGP"
 * - 7550 -> "75.50 EGP"
 */
export function formatDeliveryFeeEgp(feeMinor: number | null | undefined, currency = "EGP"): string {
  if (feeMinor === null || feeMinor === undefined || Number.isNaN(feeMinor)) {
    return "—";
  }

  const major = feeMinor / 100;
  return `${major.toLocaleString("en-US", {
    minimumFractionDigits: major % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}
