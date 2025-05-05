import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';
import {
  signupSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginWithOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
} from '../validations/index.js';

// Initialize AJV with custom settings
const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv); // Add format validation (e.g., email)
addErrors(ajv); // Enable custom error messages

const validateSignup = ajv.compile(signupSchema);
const validateLogin = ajv.compile(loginSchema);
const validateChangePassword = ajv.compile(changePasswordSchema);
const validateForgotPassword = ajv.compile(forgotPasswordSchema);
const validateResetPassword = ajv.compile(resetPasswordSchema);
const validateLoginWithOtp = ajv.compile(loginWithOtpSchema);
const validateVerifyOtp = ajv.compile(verifyOtpSchema);
const validateRefreshToken = ajv.compile(refreshTokenSchema);

/**
 * Validate request body using AJV
 * @param {string} type - Validation type ('signup' or 'login')
 * @returns {Function} Middleware function
 */
export const validateRequest = (type) => {
  let validator;
  switch (type) {
    case 'signup':
      validator = validateSignup;
      break;
    case 'login':
      validator = validateLogin;
      break;
    case 'changePassword':
      validator = validateChangePassword;
      break;
    case 'forgotPassword':
      validator = validateForgotPassword;
      break;
    case 'resetPassword':
      validator = validateResetPassword;
      break;
    case 'loginWithOtp':
      validator = validateLoginWithOtp;
      break;
    case 'verifyOtp':
      validator = validateVerifyOtp;
      break;
    case 'refreshToken':
      validator = validateRefreshToken;
      break;
  }

  return (req, res, next) => {
    const valid = validator(req.body);
    if (!valid) {
      const errors = validator.errors.map((err) => {
        if (err.keyword === 'required') {
          return err.message;
        }
        return err.message || 'Invalid input';
      });

      // Format message for missing fields
      const missingFields = validator.errors
        .filter((err) => err.keyword === 'required')
        .map(
          (err) =>
            err.params.missingProperty.charAt(0).toUpperCase() +
            err.params.missingProperty.slice(1),
        )
        .join(', ');

      const message = missingFields
        ? `${missingFields} are required`
        : errors.join(', ');

      const error = new Error(message);
      error.name = 'ValidationError';
      error.statusCode = 400;
      throw error;
    }
    next();
  };
};
