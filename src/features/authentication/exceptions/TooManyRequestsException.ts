export class TooManyRequestsException extends Error {
  constructor() {
    super("Too many registration attempts. Please wait a moment.");
    this.name = "TooManyRequestsException";
  }
}
