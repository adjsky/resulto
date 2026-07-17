export class UnwrapError extends Error {
  constructor(message: string, error?: unknown) {
    super(`${message}${error !== undefined ? `: ${error}` : ""}`);
  }
}
