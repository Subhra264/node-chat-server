import HttpErrors from "./http-errors";
import HttpError from "./HttpError";

// TODO: Expand the range of errors
export default function convertToHttpErrorFrom (err: any): HttpError {
    if (err.isHttpError) return (err as HttpError);

    // Joi Error
    if (err.isJoi) return HttpErrors.BadRequest();

    // incomplete
    return HttpErrors.ServerError();
}