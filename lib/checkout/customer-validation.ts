import type {
  CustomerDetailsInput,
  CheckoutValidationError,
} from "./types";

/**
 * Validates and sanitizes customer shipping / COD details
 */
export function validateCustomerDetails(
  input: CustomerDetailsInput | undefined
): {
  sanitized?: CustomerDetailsInput;
  errors: CheckoutValidationError[];
} {
  const errors: CheckoutValidationError[] = [];

  if (!input) {
    errors.push({
      code: "INVALID_CUSTOMER_NAME",
      field: "customerName",
      message: "Customer details are required.",
    });
    return { errors };
  }

  // 1. Customer Name (required, trimmed, 2-100 characters)
  const customerName = (input.customerName || "").trim();
  if (customerName.length < 2) {
    errors.push({
      code: "INVALID_CUSTOMER_NAME",
      field: "customerName",
      message: "Please enter your full name (minimum 2 characters).",
    });
  } else if (customerName.length > 100) {
    errors.push({
      code: "INVALID_CUSTOMER_NAME",
      field: "customerName",
      message: "Customer name must not exceed 100 characters.",
    });
  }

  // 2. Phone (required, trimmed, 6-25 characters)
  const phone = (input.phone || "").trim();
  const phoneDigitsOnly = phone.replace(/[^\d+]/g, "");
  if (phoneDigitsOnly.length < 6) {
    errors.push({
      code: "INVALID_PHONE",
      field: "phone",
      message: "Please provide a valid contact phone number.",
    });
  } else if (phone.length > 25) {
    errors.push({
      code: "INVALID_PHONE",
      field: "phone",
      message: "Phone number must not exceed 25 characters.",
    });
  }

  // 3. Email (optional, trimmed, valid format if present)
  let email: string | null = null;
  if (input.email && input.email.trim().length > 0) {
    const rawEmail = input.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (rawEmail.length > 100 || !emailRegex.test(rawEmail)) {
      errors.push({
        code: "INVALID_EMAIL",
        field: "email",
        message: "Please provide a valid email address.",
      });
    } else {
      email = rawEmail.toLowerCase();
    }
  }

  // 4. Address (required, trimmed, 5-250 characters)
  const address = (input.address || "").trim();
  if (address.length < 5) {
    errors.push({
      code: "INVALID_ADDRESS",
      field: "address",
      message: "Please provide a detailed delivery address (minimum 5 characters).",
    });
  } else if (address.length > 250) {
    errors.push({
      code: "INVALID_ADDRESS",
      field: "address",
      message: "Address must not exceed 250 characters.",
    });
  }

  // 5. City / Area (required, trimmed, 2-100 characters)
  const cityOrArea = (input.cityOrArea || "").trim();
  if (cityOrArea.length < 2) {
    errors.push({
      code: "INVALID_CITY_OR_AREA",
      field: "cityOrArea",
      message: "Please specify your city or district (minimum 2 characters).",
    });
  } else if (cityOrArea.length > 100) {
    errors.push({
      code: "INVALID_CITY_OR_AREA",
      field: "cityOrArea",
      message: "City or Area must not exceed 100 characters.",
    });
  }

  // 6. Notes (optional, max 500 characters)
  let notes: string | null = null;
  if (input.notes && input.notes.trim().length > 0) {
    const rawNotes = input.notes.trim();
    if (rawNotes.length > 500) {
      errors.push({
        code: "INVALID_NOTES",
        field: "notes",
        message: "Order notes must not exceed 500 characters.",
      });
    } else {
      notes = rawNotes;
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    sanitized: {
      customerName,
      phone,
      email,
      address,
      cityOrArea,
      notes,
    },
    errors: [],
  };
}
