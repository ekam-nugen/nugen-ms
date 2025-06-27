import log from "../config/logger.js";

/**
 * Common function to handle responses and errors
 * @param {Object} res - Express response object
 * @param {Object} [options] - Response options
 * @param {any} [options.data] - Response data for success
 * @param {string} [options.message] - Response message
 * @param {number} [options.statusCode=200] - HTTP status code
 * @param {Object} [options.error] - Error object with type, message, statusCode
 */
const sendResponse = (
  res,
  { data, message = "Operation successful", statusCode = 200, error } = {}
) => {
  if (error) {
    const errorResponse = {
      success: false,
      error: {
        type: error.type || "Server Error",
        message: error.message || "An unexpected error occurred",
        statusCode: error.statusCode || 500,
      },
    };
    log.error(
      `Error: ${errorResponse.error.message} (${errorResponse.error.statusCode})`
    );
    return res.status(errorResponse.error.statusCode).json(errorResponse);
  }

  const successResponse = {
    success: true,
    data: data || null,
    message,
    statusCode,
  };
  log.info(`Success: ${message} (${statusCode})`);
  return res.status(statusCode).json(successResponse);
};

export default sendResponse;
