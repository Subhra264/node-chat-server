/**
 * Represents a HttpError that contains a status code and a message
 */
export default class HttpError extends Error {
    public status: number;

    constructor(msg: string, status: number) {
        super(msg);
        this.status = status;
    }
}