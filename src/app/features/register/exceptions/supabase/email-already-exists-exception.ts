export class EmailAlreadyExistsException extends Error {
  constructor() {
    super('This email address is already in use.');
    this.name = 'EmailAlreadyExistsException';
  }
}
