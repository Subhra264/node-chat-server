/* Exports the HttpErrors for error handling*/

class HttpError extends Error {
  public status: number;
  public isHttpError: boolean;

  constructor(msg: string, status: number) {
    super(msg);
    this.status = status;
    this.isHttpError = true;
  }
}

const createError = (msg: string, errCode: number): HttpError => {
  return new HttpError(msg, errCode);
};

export = {
  /**
   * Returns a Bad Request HttpError with status code 400
   *
   * @param msg
   * @returns Returns a BadRequest Error
   */
  BadRequest: (msg = 'Bad Request'): HttpError => {
    return createError(msg, 400);
  },

  /**
   * Returns a UnAuthorized HttpError with status code 401
   *
   * @param msg
   * @returns Returns a Unauthorized Error
   */
  Unauthorized: (msg = 'Unauthorized request'): HttpError => {
    return createError(msg, 401);
  },

  /**
   * Returns a Forbidden HttpError with status code 403
   *
   * @param msg
   * @returns Returns a Forbidden Error
   */
  Forbidden: (msg = 'Access Forbidden'): HttpError => {
    return createError(msg, 403);
  },

  /**
   * Returns a NotFound HttpError with status code 404
   *
   * @param msg
   * @returns Returns a NotFound Error
   */
  NotFound: (msg = 'Not Found!'): HttpError => {
    return createError(msg, 404);
  },

  /**
   * Returns a Not Acceptable HttpError with status code 406
   *
   * @param msg
   * @returns Returns a NotAcceptable Error
   */
  NotAcceptable: (msg = 'Not Acceptable'): HttpError => {
    return createError(msg, 406);
  },

  /**
   * Returns a Conflict HttpError with status code 409
   *
   * @param msg
   * @returns Returns a Conflict Error
   */
  Conflict: (msg = 'Conflict'): HttpError => {
    return createError(msg, 409);
  },

  /**
   * Returns a Unprocessable Entity HttpError with status code 422
   *
   * @param msg
   * @returns Returns a UnprocessableEntity Error
   */
  UnprocessableEntity: (msg = 'Unprocessable Entity'): HttpError => {
    return createError(msg, 422);
  },

  /**
   * Returns a Internal Server HttpError with status code 500
   *
   * @param msg
   * @returns Returns a ServerError
   */
  ServerError: (msg = 'Internal Server Error'): HttpError => {
    return createError(msg, 500);
  },
};
