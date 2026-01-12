export class RegistrationFailedException extends Error {
  constructor() {
    super("registration failed.");
    this.name = "RegistrationFailedException";
  }
}
