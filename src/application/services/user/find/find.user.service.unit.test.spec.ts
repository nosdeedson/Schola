import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { FindUserService } from './find.user.service';


describe('FindUserService tests unit', () =>{

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should find an user', async () =>{
        let user = DomainMocks.mockUserTeacher();
        const userRepository = await MockRepositoriesForUnitTest.mockRepositories();
        userRepository.find = jest.fn().mockImplementationOnce(() =>{
            return user;
        });
        let wantedId = user.getId();
        const service = new FindUserService(userRepository);
        let result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId);
        expect(userRepository.find).toHaveBeenCalledTimes(1);
        expect(userRepository.find).toHaveBeenCalledWith(wantedId)
    });

    it('should not find an user', async () =>{
        let user = DomainMocks.mockUserTeacher();
        const userRepository = await MockRepositoriesForUnitTest.mockRepositories();
        userRepository.find = jest.fn().mockImplementationOnce(() =>{
            return null;
        });
        let wantedId = user.getId();
        const service = new FindUserService(userRepository);
        try{
            let result = await service.execute(wantedId);
        } catch(error){
            expect(error).toEqual( {errors: [ { context: 'user', message: 'user not found' } ]});
        }
    });
});