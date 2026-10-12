function successResponse(res, statusCode, message, data = null) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function errorResponse(res, statusCode, message, errors = undefined) {
  const payload = {
    success: false,
    message,
  };

  if (errors) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  successResponse,
  errorResponse,
};
