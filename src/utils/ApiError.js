class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    stack = "",
    errors = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Convert the error instance to a JSON-friendly format
  toJSON() {
    return {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      errors: this.errors,
      stack: process.env.NODE_ENV === "development" ? this.stack : undefined,
    };
  }
}

module.exports = ApiError;
