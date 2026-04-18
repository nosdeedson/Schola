import { PasswordHasher } from "./password-hasher";

describe('PasswordEncription', () => {
    const bcryptRegex = /^\$2[ayb]\$\d{2}\$[./A-Za-z0-9]{53}$/;

    it("should instantiate", () => {
        expect(new PasswordHasher()).toBeDefined();
    })

    it('should encrypt a password', () => {
        const password = '1234@Mudar';
        const encryptedPassword = PasswordHasher.encryptPassword(password);
        expect(encryptedPassword).toMatch(bcryptRegex);
    });

    it('should validate the password as equal', async () => {
        const password = '1234@Mudar';
        const savedPassword = PasswordHasher.encryptPassword(password);
        const validPassword = await PasswordHasher.compare(password, savedPassword);
        expect(validPassword).toBeTruthy();
    });

    it('should invalid the password', async () => {
        const password = '1234@Mudar';
        const savedPassword = await PasswordHasher.encryptPassword("12345@Mudar");
        const invalidPassword = await PasswordHasher.compare(password, savedPassword);
        expect(invalidPassword).toBeFalsy();
    });
});
