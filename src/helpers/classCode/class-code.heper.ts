export class ClassCodeHelper{
    static createClassCode(): string{
        let code = Math.floor(Math.random() * 1000000);
        return code.toString().padStart(6, '0');
    }
}