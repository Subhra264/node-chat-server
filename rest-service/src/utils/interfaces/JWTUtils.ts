export interface JWTTokenSignPayload {
  userId: string;
}

export interface UserPayload extends JWTTokenSignPayload {
  username: string;
}

export interface GroupInvitationPayload extends JWTTokenSignPayload {
  groupId: string;
}

export enum TokenKeyType {
  JWT_ACCESS_KEY = 'JWT_ACCESS_KEY',
  JWT_REFRESH_KEY = 'JWT_REFRESH_KEY',
  JWT_GROUP_INVITATION_KEY = 'JWT_GROUP_INVITATION_KEY',
}
