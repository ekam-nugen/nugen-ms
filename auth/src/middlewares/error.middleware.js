export default (error, req, res, _next) => {
  let errorMessage = {
    status: error.status || 500,
    message: error.message || 'Unknown error',
    success: false,
    stack: error.stack || '',
    method: req.method,
    url: req.url,
  };
  res.status(errorMessage.status).json({
    success: errorMessage.success,
    message: errorMessage.message,
  });
};
