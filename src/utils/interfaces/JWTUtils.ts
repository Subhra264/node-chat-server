export interface UserPayload {
    userId: string;
    username: string;
}

export enum TokenKeyType {
    JWT_ACCESS_KEY = 'JWT_ACCESS_KEY',
    JWT_REFRESH_KEY = 'JWT_REFRESH_KEY',
    JWT_GROUP_INVITATION_KEY = 'JWT_GROUP_INVITATION_KEY'
}