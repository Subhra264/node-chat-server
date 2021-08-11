import jwt from 'jsonwebtoken';
import HttpErrors from '../../errors/http-errors';
import { TokenType, UserPayload } from '../interfaces/JWTUtils';

export const JWT_ERROR_CODE = 'token_not_valid';

/**
 * Returns the signed JsonWebToken
 * 
 * @param payload Payload for signing token
 * @param type The Token Type, It has two possible values - 1. ACCESS_TOKEN 2. REFRESH_TOKEN
 * @returns Promise that resolves to a string
 */
export async function signJWTToken(payload: UserPayload, type: TokenType): Promise<string> {

    return new Promise((resolve, reject) => {

        let key: string;
        let expiresIn: string;
        if (type === TokenType.ACCESS_TOKEN) {
            if (!process.env.JWT_ACCESS_KEY) {
                return reject(HttpErrors.ServerError());
            }

            key = process.env.JWT_ACCESS_KEY;
            expiresIn = '1h';
        } else {
            if (!process.env.JWT_REFRESH_KEY) {
                return reject(HttpErrors.ServerError());
            }

            key = process.env.JWT_REFRESH_KEY;
            expiresIn = '15d';
        }

        const options = {
            expiresIn,
            audience: payload.userId
        };

        jwt.sign(payload, key, options, (err: Error | null, token: string | undefined) => {
            if (err || !token) return reject(HttpErrors.ServerError());
            resolve(token);
        });
    });
    
}

/**
 * Verifies the given token and returns the payload
 * @param token The token to verify
 * @param type The Type of token, has two possible values - 1. ACCESS_TOKEN 2. REFRESH_TOKEN
 * @returns Promise that resolves to the payload
 */
export async function verifyToken(token: string, type: TokenType): Promise<Record<string, unknown>> {

    return new Promise((resolve, reject) => {
        let key: string;

        if (type == TokenType.ACCESS_TOKEN) {
            if (!process.env.JWT_ACCESS_KEY) return reject(HttpErrors.ServerError());
            key = process.env.JWT_ACCESS_KEY;
        } else {
            if (!process.env.JWT_REFRESH_KEY) return reject(HttpErrors.ServerError());
            key = process.env.JWT_REFRESH_KEY;
        }
        jwt.verify(token, key, (err, payload) => {
            if (err || !payload) {
                return reject(HttpErrors.Unauthorized(JWT_ERROR_CODE));
            }
            resolve(payload as Record<string, unknown>); 
        });
    });
}