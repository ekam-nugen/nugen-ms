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
  createActivityLogSchema,
  getActivityLogsByOrganisationSchema,
} from '../validations/index.js';
import { validateTokenSchema } from '../validations/schemas.js';

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
const validateToken = ajv.compile(validateTokenSchema);
const validateCreateActivityLog = ajv.compile(createActivityLogSchema);
const validateGetActivityLogsByOrganisation = ajv.compile(
  getActivityLogsByOrganisationSchema,
);

/**
 * Validate request body or params using AJV
 * @param {string} type - Validation type (e.g., 'signup', 'createActivityLog')
 * @param {string} source - Source of data to validate ('body' or 'params')
 * @returns {Function} Middleware function
 */
export const validateRequest = (type, source = 'body') => {
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
    case 'validateToken':
      validator = validateToken;
      break;
    case 'createActivityLog':
      validator = validateCreateActivityLog;
      break;
    case 'getActivityLogsByOrganisation':
      validator = validateGetActivityLogsByOrganisation;
      break;
    default:
      throw new Error('Invalid validation type');
  }

  return (req, res, next) => {
    const data = source === 'params' ? req.params : req.body;
    const valid = validator(data);
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
