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
    const error = new HttpError(msg, errCode);

    return error;
}

export = {

    /**
     * Returns a Bad Request HttpError with status code 400
     * 
     * @param msg 
     * @returns Returns a BadRequest Error
     */
    BadRequest: (msg?: string): HttpError => {
        return createError(msg? msg: 'Bad Request', 400);
    },

    /**
     * Returns a UnAuthorized HttpError with status code 401
     * 
     * @param msg 
     * @returns Returns a Unauthorized Error
     */
    Unauthorized: (msg?: string): HttpError => {
        return createError(msg? msg : 'Unauthorized request', 401);
    },

    /**
     * Returns a Forbidden HttpError with status code 403
     * 
     * @param msg 
     * @returns Returns a Forbidden Error
     */
    Forbidden: (msg?: string): HttpError => {
        return createError(msg? msg : 'Access Forbidden', 403);
    },

    /**
     * Returns a NotFound HttpError with status code 404
     * 
     * @param msg 
     * @returns Returns a NotFound Error
     */
     NotFound: (msg?: string): HttpError => {
        return createError(msg? msg : 'Not Found!', 404);
    },

    /**
     * Returns a Not Acceptable HttpError with status code 406
     * 
     * @param msg 
     * @returns Returns a NotAcceptable Error
     */
    NotAcceptable: (msg?: string): HttpError => {
        return createError(msg? msg : 'Not Acceptable', 406);
    },

    /**
     * Returns a Conflict HttpError with status code 409
     * 
     * @param msg 
     * @returns Returns a Conflict Error
     */
    Conflict: (msg?: string): HttpError => {
        return createError(msg? msg : 'Conflict', 409);
    }, 

    /**
     * Returns a Unprocessable Entity HttpError with status code 422
     * 
     * @param msg 
     * @returns Returns a UnprocessableEntity Error
     */
    UnprocessableEntity: (msg?: string): HttpError => {
        return createError(msg? msg : 'Unprocessabe Entity', 422);
    },

    /**
     * Returns a Internal Server HttpError with status code 500
     * 
     * @param msg 
     * @returns Returns a ServerError
     */
    ServerError: (msg?: string): HttpError => {
        return createError(msg? msg : 'Internal Server Error', 500);
    }
};