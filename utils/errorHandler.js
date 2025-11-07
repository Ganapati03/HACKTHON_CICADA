export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Mongoose Bad ID Error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    return res.status(400).json({ success: false, message });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    return res.status(400).json({ success: false, message });
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid Token';
    return res.status(401).json({ success: false, message });
  }

  // JWT Expire Error
  if (err.name === 'TokenExpiredError') {
    const message = 'Token has expired';
    return res.status(401).json({ success: false, message });
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
