export const getSuccessResponse = (message: string, data?: unknown) => ({
  statusCode: 200,
  body: JSON.stringify({
    message,
    data,
  }),
});

export const getNoContentResponse = () => ({
  statusCode: 204,
});

export const getBadRequestResponse = (message: string) => ({
  statusCode: 400,
  body: JSON.stringify({
    message,
  }),
});

export const getNotFoundResponse = (message: string) => ({
  statusCode: 404,
  body: JSON.stringify({
    message,
  }),
});

export const getInternalServerErrorResponse = (
  message: string,
  error: Error | unknown
) => ({
  statusCode: 500,
  body: JSON.stringify({
    message,
    error,
  }),
});
