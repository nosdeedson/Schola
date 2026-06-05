import { ClassCodeHelper } from './class-code.heper'

describe('ClassCodeHelper unit test', () =>{
    
    it('should return a code with six digits', () =>{
        let wantedCode = ClassCodeHelper.createClassCode();
        expect(wantedCode).toBeDefined();
        expect(wantedCode.length).toBe(6);
    });
})