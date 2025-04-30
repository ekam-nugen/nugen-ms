export const signupSchema = {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email', minLength: 1 },
      password: { type: 'string', minLength: 6 },
      name: { type: 'string', minLength: 1 },
    },
    required: ['email', 'password', 'name'],
    additionalProperties: false,
    errorMessage: {
      required: {
        email: 'Email is required',
        password: 'Password is required',
        name: 'Name is required',
      },
      properties: {
        email: 'Email must be a valid email address',
        password: 'Password must be at least 6 characters long',
        name: 'Name must be a non-empty string',
      },
    },
  };
  