export const loginSchema = {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email', minLength: 1 },
      password: { type: 'string', minLength: 6 },
    },
    required: ['email', 'password'],
    additionalProperties: false,
    errorMessage: {
      required: {
        email: 'Email is required',
        password: 'Password is required',
      },
      properties: {
        email: 'Email must be a valid email address',
        password: 'Password must be at least 6 characters long',
      },
    },
  };