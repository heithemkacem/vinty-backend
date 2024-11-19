const createErrorResponse = (message, status) => ({
    ok: false,
    status,
    message,
  });
  
  module.exports = { createErrorResponse };
  