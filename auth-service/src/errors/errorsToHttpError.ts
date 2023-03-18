import HttpErrors, { HttpError } from './http-errors';

// TODO: Expand the range of errors
export default function convertToHttpErrorFrom(err: any): HttpError {
  if (err.isHttpError) return err as HttpError;

  // Joi Error
  if (err.isJoi) return HttpErrors.BadRequest(err.message);

  // incomplete
  return HttpErrors.ServerError();
}
