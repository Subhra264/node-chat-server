/**
 * Represents a HttpError that contains a status code and a message
 */

export default interface HttpError extends Error {
    status: number;
    isHttpError: boolean;
}