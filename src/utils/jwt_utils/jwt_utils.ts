import jwt from 'jsonwebtoken';
import HttpErrors from '../../errors/http-errors';

export enum TokenType {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN'
}

/**
 * Returns the signed JsonWebToken
 * 
 * @param userId 
 * @returns Promise that resolves to a string
 */
export async function signJWTToken(userId: string, type: TokenType): Promise<string> {

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

        const payload = { userId };
        const options = {
            expiresIn,
            audience: userId
        };

        jwt.sign(payload, key, options, (err: Error | null, token: string | undefined) => {
            if (err || !token) return reject(HttpErrors.ServerError());
            resolve(token);
        });
    });
    
}

/**
 * Verifies the given token and returns the payload
 * @param token 
 * @returns Promise that resolves to the payload
 */
export async function verifyToken(token: string): Promise<Record<string, unknown>> {

    return new Promise((resolve, reject) => {
        if (!process.env.JWT_ACCESS_KEY) {
            return reject(HttpErrors.ServerError());
        }

        jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, payload) => {
            if (err || !payload) {
                return reject(HttpErrors.Unauthorized());
            }
            resolve(payload as Record<string, unknown>); 
        });
    });
}