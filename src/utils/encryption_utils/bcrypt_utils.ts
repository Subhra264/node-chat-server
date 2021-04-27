import bcrypt from 'bcrypt';
import HttpErrors from '../../errors/http-errors';

/**
 * Returns the hash of the given password
 * 
 * @param password 
 * @returns Promise that resolves to the hash of the given password
 */
export async function hashPassword(password: string): Promise<string> {
    try{
        const salt: string = await bcrypt.genSalt(12);
        const hashedPassword: string = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch(err) {
        throw await HttpErrors.ServerError();
    }
}

/**
 * Returns a boolean value indicating whether the password matches with the withPassword 
 * 
 * @param password 
 * @param withPassword 
 * @returns Promise that resolves to a boolean value
 */
export async function comparePassword(password: string, withPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, withPassword);
    } catch(err) {
        throw await HttpErrors.ServerError();
    }
}