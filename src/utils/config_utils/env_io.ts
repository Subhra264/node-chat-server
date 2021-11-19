import fs from 'fs';
import { TokenKeyType } from '../interfaces/JWTUtils';
import generateJWTKeys from '../jwt_utils/generate_key';

export function appendKeysToENV(envPath: string): void {
    const jwtKeys = generateJWTKeys();

    try {
        for (const tokenKey in jwtKeys) {
            fs.appendFileSync(envPath, `\n${tokenKey}=${jwtKeys[tokenKey]}`);
        } 

    } catch(err) {
        console.error(err);
        console.log('exiting...');
        process.exit();
    }
}

export function removeKeysFromENV(envPath: string): void {
    try {
        const envVars_: string[] = [];
        const envVars: string = fs.readFileSync(envPath, {
            encoding: 'utf8'
        });
        envVars.split('\n').forEach((envVar: string) => {
            let matched = false;
            for (const tokenKeyType in TokenKeyType) {
                if (envVar.startsWith(tokenKeyType)) {
                    matched = true;
                    break;
                }
            }
            if (!matched) envVars_.push(envVar);
        });

        fs.writeFileSync(envPath, envVars_.join('\n'));

    } catch(err) {
        console.log('Please delete the JWT_ACCESS_KEY and JWT_REFRESH_KEY env variables manually before starting the dev server again!');
    }
}

