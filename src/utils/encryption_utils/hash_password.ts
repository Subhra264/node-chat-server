import bcrypt from 'bcrypt';

export default async function(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(12);
    const hashedPassword: string = await bcrypt.hash(password, salt);

    return hashedPassword;
}