import jwt from 'jsonwebtoken';
import HttpErrors from '../../errors/http-errors';

/**
 * Returns the signed JsonWebToken
 * 
 * @param userId 
 * @returns Promise that resolves to a string
 */
export async function signAccessToken(userId: string): Promise<string> {
    
    return new Promise((resolve, reject) => {
        const payload = { userId };
        const options = {
            expiresIn: '1h',
            audience: userId
        };

        if (!process.env.JWT_ACCESS_KEY) {
            return reject(HttpErrors.ServerError());
        }

        jwt.sign(payload, process.env.JWT_ACCESS_KEY, options, (err: Error | null, token: string | undefined) => {
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
                console.log('Error', err);
                return reject(HttpErrors.Unauthorized());
            }
            resolve(payload as Record<string, unknown>); 
        });
    });
}