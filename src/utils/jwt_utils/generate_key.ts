import crypto from 'crypto';
import { TokenKeyType } from '../interfaces/JWTUtils';

interface JWTKeys {
    [jwtKey: string]: string;
}

export default function generateJWTKeys(): JWTKeys {
    const jwtKeys: JWTKeys = {};

    for (const keyType in TokenKeyType) {
        jwtKeys[keyType] = crypto.randomBytes(32).toString('hex');
    }

    return jwtKeys;
}