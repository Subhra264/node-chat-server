import jwt from 'jsonwebtoken';
import HttpErrors from '../errors/http-errors';

export const JWT_ERROR_CODE = 'token_not_valid';

export interface JWTTokenSignPayload {
  userId: string;
}

export interface UserPayload extends JWTTokenSignPayload {
  username: string;
}

export enum TokenKeyType {
  JWT_ACCESS_KEY = 'JWT_ACCESS_KEY',
  JWT_REFRESH_KEY = 'JWT_REFRESH_KEY',
}

/**
 * Returns the signed JsonWebToken
 *
 * @param payload Payload for signing token
 * @param keyType The Token Type, It has two possible values - 1. ACCESS_TOKEN 2. REFRESH_TOKEN
 * @returns Promise that resolves to a string
 */
export async function signJWTToken(
  payload: JWTTokenSignPayload,
  keyType: TokenKeyType,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const key: string | undefined = process.env[keyType];
    let expiresIn = '1h';

    console.log('keyType :', keyType, 'key :', key);
    if (!key) return reject(HttpErrors.ServerError());

    if (keyType === TokenKeyType.JWT_REFRESH_KEY) expiresIn = '15d';

    const options = {
      expiresIn,
      audience: payload.userId,
    };
    console.log('Token signing payload', payload);

    jwt.sign(
      payload,
      key,
      options,
      (err: Error | null, token: string | undefined) => {
        console.log('Error signing JWT', err?.message);
        console.log('Token after signing', token);
        if (err || !token) return reject(HttpErrors.ServerError());
        resolve(token);
      },
    );
  });
}

/**
 * Verifies the given token and returns the payload
 * @param token The token to verify
 * @param keyType The Type of token, has two possible values - 1. ACCESS_TOKEN 2. REFRESH_TOKEN
 * @returns Promise that resolves to the payload
 */
export async function verifyToken(
  token: string,
  keyType: TokenKeyType,
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const key: string | undefined = process.env[keyType];

    if (!key) return reject(HttpErrors.ServerError());

    jwt.verify(token, key, (err, payload) => {
      if (err || !payload) {
        console.log('JWT verify token err', err?.message);
        return reject(HttpErrors.Unauthorized(JWT_ERROR_CODE));
      }
      resolve(payload as Record<string, unknown>);
    });
  });
}
