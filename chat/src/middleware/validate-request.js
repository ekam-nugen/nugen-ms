import Ajv from "ajv";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
import {
  createOrganizationSchema,
  checkOrganizationSchema,
  joinOrganizationSchema,
  updateOrganizationSchema,
} from "../../../organization/src/validations/index.js";
import { createInvitationSchema } from "../../../organization/src/validations/schemas.js";

const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);
addErrors(ajv);

const validateCreateOrganization = ajv.compile(createOrganizationSchema);
const validateCheckOrganization = ajv.compile(checkOrganizationSchema);
const validateJoinOrganization = ajv.compile(joinOrganizationSchema);
const validateUpdateOrganization = ajv.compile(updateOrganizationSchema);
const validateCreateInvitation = ajv.compile(createInvitationSchema);

/**
 * Validate request body using AJV
 * @param {string} type - Validation type ('signup' or 'login')
 * @returns {Function} Middleware function
 */
export const validateRequest = (type) => {
  let validator;
  switch (type) {
    case "createOrganization":
      validator = validateCreateOrganization;
      break;
    case "checkOrganization":
      validator = validateCheckOrganization;
      break;
    case "joinOrganization":
      validator = validateJoinOrganization;
      break;
    case "updateOrganization":
      validator = validateUpdateOrganization;
      break;
    case "createInvitation":
      validator = validateCreateInvitation;
  }

  return (req, res, next) => {
    const valid = validator(req.body);
    if (!valid) {
      const errors = validator.errors.map((err) => {
        if (err.keyword === "required") {
          return err.message;
        }
        return err.message || "Invalid input";
      });

      // Format message for missing fields
      const missingFields = validator.errors
        .filter((err) => err.keyword === "required")
        .map(
          (err) =>
            err.params.missingProperty.charAt(0).toUpperCase() +
            err.params.missingProperty.slice(1)
        )
        .join(", ");

      const message = missingFields
        ? `${missingFields} are required`
        : errors.join(", ");

      const error = new Error(message);
      error.name = "ValidationError";
      error.statusCode = 400;
      throw error;
    }
    next();
  };
};
