import AJV from "ajv";
// const createHttpError = require("http-errors");
import addErrors from "ajv-errors";

const ajv = new AJV({ allErrors: true, useDefaults: true });
addErrors(ajv);

export default (schema, data) => {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    const errorMessages = validate.errors.map((errorData) => {
      let path = errorData.instancePath.startsWith("/")
        ? errorData.instancePath.slice(1)
        : errorData.instancePath;
      if ( path == ""){
        path = errorData?.params?.missingProperty;
      }
      return `${path} : ${errorData.message}`;
    });

    return {
      isValid: false,
      errors: errorMessages,
    };
  }
  return { isValid: true };
};