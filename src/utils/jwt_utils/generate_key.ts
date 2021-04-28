import crypto from 'crypto';

export default function generateJWTKeys(): string[] {
    const accessTokenKey: string = crypto.randomBytes(32).toString('hex');
    const refreshTokenKey: string = crypto.randomBytes(32).toString('hex');

    return [accessTokenKey, refreshTokenKey];
}