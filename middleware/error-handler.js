const { CustomAPIError } = require('../errors/custom-error')
const errorHandlerMiddleware = (err, req, res, next) => {
  console.error('Error caught:', err);
  
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  
  // Log detailed error for debugging
  const errorResponse = {
    msg: err.message || 'Something went wrong, please try again',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };
  
  return res.status(500).json(errorResponse)
}

module.exports = errorHandlerMiddleware
