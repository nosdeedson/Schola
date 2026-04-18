import { compare, hashSync } from 'bcrypt';

export class PasswordHasher {
    private static SALT_ROUNDS = 10;

    static encryptPassword(password: string): string {
        const encryptedPassword = hashSync(password, PasswordHasher.SALT_ROUNDS);
        return encryptedPassword;
    }

    static async compare(password: string, savedPassword: string): Promise<boolean> {
        return await compare(password, savedPassword);
    }
}
