'use strict';

/**
 * Central Express error-handling middleware.
 * Must be registered AFTER all routes (4-argument signature required by Express).
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next  // eslint-disable-line no-unused-vars
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log server-side errors (not client 4xx)
  if (status >= 500) {
    console.error(`[errorHandler] ${status} ${req.method} ${req.path} —`, err);
  } else {
    console.warn(`[errorHandler] ${status} ${req.method} ${req.path} — ${message}`);
  }

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
