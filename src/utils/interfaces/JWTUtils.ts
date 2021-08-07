export interface UserPayload {
    userId: string;
}

export enum TokenType {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN'
}