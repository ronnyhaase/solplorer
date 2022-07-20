export class InvalidAddressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidAddressError';
    Object.setPrototypeOf(this, InvalidAddressError.prototype)
  }
}
