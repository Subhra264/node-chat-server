import jwt from 'jsonwebtoken';
import HttpErrors from '../../errors/http-errors';

export async function signAccessToken(userId: string): Promise<string> {
    
    return new Promise((resolve, reject) => {
        const payload = { userId };
        const options = {
            expiresIn: '1h',
            audience: userId
        };

        if(!process.env.JWT_ACCESS_KEY) {
            return reject(HttpErrors.ServerError());
        }

        jwt.sign(payload, process.env.JWT_ACCESS_KEY, options, (err: Error | null, token: string | undefined) => {
            if(err || !token) return reject(HttpErrors.ServerError());
            resolve(token);
        });
    });
    
}