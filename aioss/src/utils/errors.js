/**
 * Custom error for validation issues
 */
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Custom error for authentication issues
 */
export class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Custom error for database issues
 */
export class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class TransactionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TransactionError';
  }
}
