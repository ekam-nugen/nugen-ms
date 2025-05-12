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

export const signupSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', minLength: 1 },
    password: { type: 'string', minLength: 6 },
    firstName: { type: 'string', minLength: 1 },
    lastName: { type: 'string', minLength: 1 },
  },
  required: ['email', 'password', 'firstName', 'lastName'],
  additionalProperties: false,
  errorMessage: {
    required: {
      email: 'Email is required',
      password: 'Password is required',
      firstName: 'First name is required',
      lastName: 'Last name is required',
    },
    properties: {
      email: 'Email must be a valid email address',
      password: 'Password must be at least 6 characters long',
      firstName: 'First name cannot be empty',
      lastName: 'Last name cannot be empty',
    },
  },
};

export const changePasswordSchema = {
  type: 'object',
  properties: {
    oldPassword: { type: 'string', minLength: 6 },
    newPassword: { type: 'string', minLength: 6 },
  },
  required: ['oldPassword', 'newPassword'],
  additionalProperties: false,
  errorMessage: {
    required: 'Old and new passwords are required',
    properties: {
      oldPassword: 'Old password must be at least 6 characters',
      newPassword: 'New password must be at least 6 characters',
    },
  },
};

export const forgotPasswordSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', minLength: 1 },
  },
  required: ['email'],
  additionalProperties: false,
  errorMessage: {
    required: {
      email: 'Email is required',
    },
    properties: {
      email: 'Email must be a valid email address',
    },
  },
};

export const resetPasswordSchema = {
  type: 'object',
  properties: {
    newPassword: { type: 'string', minLength: 6 },
  },
  required: ['newPassword'],
  additionalProperties: false,
  errorMessage: {
    required: {
      newPassword: 'New password is required',
    },
    properties: {
      newPassword: 'New password must be at least 6 characters',
    },
  },
};

export const loginWithOtpSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
  },
  required: ['email'],
  additionalProperties: false,
  errorMessage: {
    required: {
      email: 'Email is required',
    },
    properties: {
      email: 'Invalid email format',
    },
  },
};

export const verifyOtpSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    otp: { type: 'string', pattern: '^[0-9]{6}$' },
  },
  required: ['email', 'otp'],
  additionalProperties: false,
  errorMessage: {
    required: 'Email and OTP are required',
    properties: {
      email: 'Invalid email format',
      otp: 'OTP must be a 6-digit number',
    },
  },
};

export const refreshTokenSchema = {
  type: 'object',
  properties: {
    refreshToken: { type: 'string', minLength: 1 },
  },
  required: ['refreshToken'],
  additionalProperties: false,
  errorMessage: {
    required: 'Refresh token is required',
    properties: {
      refreshToken: 'Refresh token is required',
    },
  },
};

export const validateTokenSchema = {
  type: 'object',
  properties: {
    accessToken: { type: 'string', minLength: 1 },
  },
  required: ['accessToken'],
  additionalProperties: false,
  errorMessage: {
    required: 'Access Token is required',
    properties: {
      token: 'Access Token is required',
    },
  },
};
