import fs from 'fs';
import generateJWTKeys from '../jwt_utils/generate_key';

export function appendKeysToENV(envPath: string): void {
    const [accessTokenKey, refreshTokenKey] = generateJWTKeys();

    try {
        fs.appendFileSync(envPath, `\nJWT_ACCESS_KEY=${accessTokenKey}`);
        fs.appendFileSync(envPath, `\nJWT_REFRESH_KEY=${refreshTokenKey}`);

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
            if (!envVar.startsWith('JWT_ACCESS_KEY') && !envVar.startsWith('JWT_REFRESH_KEY')) {
                envVars_.push(envVar);
            }
        });

        fs.writeFileSync(envPath, envVars_.join('\n'));

    } catch(err) {
        console.log('Please delete the JWT_ACCESS_KEY and JWT_REFRESH_KEY env variables manually before starting the dev server again!');
    }
}

