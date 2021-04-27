import bcrypt from 'bcrypt';
import HttpErrors from '../../errors/http-errors';

export async function hashPassword(password: string): Promise<string> {
    try{
        const salt: string = await bcrypt.genSalt(12);
        const hashedPassword: string = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch(err) {
        throw await HttpErrors.ServerError();
    }
}

export async function comparePassword(password: string, withPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, withPassword);
    } catch(err) {
        throw await HttpErrors.ServerError();
    }
}