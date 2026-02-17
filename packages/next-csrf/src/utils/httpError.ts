/**
 * @opensourceframework/next-csrf
 * CSRF protection for Next.js applications
 * 
 * @original-author Juan Olvera (j0lv3r4)
 * @original-repo https://github.com/j0lv3r4/next-csrf
 * @license MIT
 */

/**
 * Custom HTTP Error class for CSRF-related errors
 * Extends the standard Error class with HTTP status code support
 */
export class HttpError extends Error {
  /** HTTP status code */
  public readonly status: number;

  /**
   * Creates a new HttpError instance
   * @param status - HTTP status code (default: 403)
   * @param message - Error message
   */
  constructor(status: number = 403, message: string) {
    super(message);
    
    this.name = 'HttpError';
    this.status = status;
    this.message = message;

    // Maintains proper stack trace for where the error was thrown (only available on V8)
    if ('captureStackTrace' in Error) {
      (Error as typeof Error & { captureStackTrace: (target: object, constructor: Function) => void }).captureStackTrace(this, HttpError);
    }
  }
}
