/**
 * Controlled Authorization Error
 *
 * Designed to prevent leaking internal database, session, or credential details.
 */
export class AdminAuthorizationError extends Error {
  readonly code:
    | "UNAUTHENTICATED"
    | "UNAUTHORIZED"
    | "INACTIVE"
    | "INSUFFICIENT_PERMISSIONS";

  constructor(
    message: string = "Unauthorized: Admin access required.",
    code:
      | "UNAUTHENTICATED"
      | "UNAUTHORIZED"
      | "INACTIVE"
      | "INSUFFICIENT_PERMISSIONS" = "UNAUTHORIZED"
  ) {
    super(message);
    this.name = "AdminAuthorizationError";
    this.code = code;
  }
}
