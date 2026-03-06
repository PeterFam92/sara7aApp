export const errorResponse = ({
  res,
  statusCode = 400,
  message = "Error",
  extra = undefined,
}) => {
  const error = new Error(
    typeof message === "string" ? message : message?.message || "Error",
  );
  error.status = statusCode;
  error.extra = extra;
  throw error;
};

export const badRequestException = (
  message = "Bad Request",
  extra = undefined,
) => {
  return errorResponse({ statusCode: 400, message, extra });
};
export const conflictException = (message = "Conflict", extra = undefined) => {
  return errorResponse({ statusCode: 409, message, extra });
};

export const notFoundException = (message = "Not Found", extra = undefined) => {
  return errorResponse({ statusCode: 404, message, extra });
};

export const unAuthorizedException = (
  message = "Unauthorized",
  extra = undefined,
) => {
  return errorResponse({ statusCode: 401, message, extra });
};

export const forbiddenException = (
  message = "Forbidden",
  extra = undefined,
) => {
  return errorResponse({ statusCode: 403, message, extra });
};

export const internalServerErrorException = (
  message = "Internal Server Error",
  extra = undefined,
) => {
  return errorResponse({ statusCode: 500, message, extra });
};

export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  return res
    .status(statusCode)
    .json({
      message: err.message,
      stack: err.stack,
      extra: err.extra,
      statusCode,
    });
};
