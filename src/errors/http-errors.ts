/* Exports the HttpErrors for error handling*/

import HttpError from './HttpError';

const createError = (msg: string, errCode: number): HttpError => {
    const error = new HttpError(msg, errCode);

    return error;
}

export = {

    /**
     * Returns a Bad Request HttpError with status code 400
     * 
     * @param msg 
     * @returns Promise<HttpError>
     */
    BadRequest: async (msg?: string): Promise<HttpError> => {
        return createError(msg? msg: 'Bad Request', 400);
    },

    /**
     * Returns a UnAuthorized HttpError with status code 401
     * 
     * @param msg 
     * @returns Promise: <HttpError>
     */
    Unauthorized: async (msg?: string): Promise<HttpError> => {
        return createError(msg? msg : 'Unauthorized request', 401);
    },

    /**
     * Returns a Forbidden HttpError with status code 403
     * 
     * @param msg 
     * @returns Promise<HttpError>
     */
    Forbidden: async (msg?: string): Promise<HttpError> => {
        return createError(msg? msg : 'Access Forbidden', 403);
    },

    /**
     * Returns a NotFound HttpError with status code 404
     * 
     * @param msg 
     * @returns Promise<HttpError>
     */
     NotFound: async (msg?: string): Promise<HttpError> => {
        return createError(msg? msg : 'Not Found!', 404);
    },

    /**
     * Returns a Not Acceptable HttpErro with status code 406
     * 
     * @param msg 
     * @returns Promise<HttpError>
     */
    NotAcceptable: async (msg?: string): Promise<HttpError> => {
        return createError(msg? msg : 'Not Acceptable', 406);
    },

    /**
     * Returns a Conflict HttpError with status code 409
     * 
     * @param msg 
     * @returns Promise<HttpError>
     */
    Conflict: async (msg?: string): Promise<HttpError> => {
        return createError(msg? msg : 'Conflict', 409);
    }, 

    /**
     * Returns a Unprocessable Entity HttpError with status code 422
     * 
     * @param msg 
     * @returns Promise<HttpError>
     */
    UnprocessableEntity: async (msg?: string): Promise<HttpError> => {
        return createError(msg? msg : 'Unprocessabe Entity', 422);
    },

    /**
     * Returns a Internal Server Error HttpError with status code 500
     * 
     * @param msg 
     * @returns Promise<HttpError>
     */
    ServerError: async (msg?: string): Promise<HttpError> => {
        return createError(msg? msg : 'Internal Server Error', 500);
    }
};