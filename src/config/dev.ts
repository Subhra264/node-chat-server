import fs from 'fs';
import path from 'path';
import generateJWTKeys from '../utils/jwt_utils/generate_key';

function appendKeysToENV(): void {
    const [accessTokenKey, refreshTokenKey] = generateJWTKeys();

    try {
        const envPathName = path.resolve(__dirname, '../../.env');

        fs.appendFileSync(envPathName, `JWT_ACCESS_KEY=${accessTokenKey}\n`);
        fs.appendFileSync(envPathName, `JWT_REFRESH_KEY=${refreshTokenKey}`);

    } catch(err) {
        console.error(err);
        console.log('exiting...');
        process.exit();
    }
}

appendKeysToENV();

require('dotenv').config();