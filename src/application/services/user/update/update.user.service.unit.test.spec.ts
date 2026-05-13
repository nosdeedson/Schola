import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { UserEntity } from "../../../../infrastructure/entities/user/user.entity";
import { UpdateUserDto } from './update.user.dto';
import { UpdateUserService } from './update.user.service';


describe('UpdateUserService unit tests', () => {

    let user;
    let userEntity: UserEntity;
    let updateUserDto: UpdateUserDto;
    let userRepository: any;

    beforeEach(() => {
        user = DomainMocks.mockUserTeacher();
        userEntity = UserEntity.toUserEntity(user);
        updateUserDto = { id: userEntity.id, email: 'test@test', nickname: 'test', password: '4321'};
        userRepository = MockRepositoriesForUnitTest.mockRepositories();
    });

    it('should throw an error because id is not present ', async () =>{
        let input = {  email: 'test@test', nickname: 'test', password: '4321'};
        
        try {
            const service = new UpdateUserService(userRepository);
            await service.execute(input as UpdateUserDto)
        } catch (error) {
            expect(error).toEqual({errors :[{context: 'user', message: 'id must be informed'}]});
            //@ts-ignore
            expect(error.errors[0].message).toBe('id must be informed');
        }
    });

    it('should throw an error because dto has just the id ', async () =>{
        let input = {  id: '4321'};
        
        try {
            const service = new UpdateUserService(userRepository);
            await service.execute(input as UpdateUserDto)
        } catch (error) {
            expect(error).toEqual({errors: [{context: 'user', message: 'at least one atribute must be passed to update an user'}]});
            //@ts-ignore
            expect(error.errors[0].message).toBe('at least one atribute must be passed to update an user');
        }
    });

    it('should update an user', async () =>{
        userRepository.find = jest.fn().mockImplementationOnce(() => {return userEntity});
        userRepository.update = jest.fn().mockImplementationOnce(() => {void 0})
        const service = new UpdateUserService(userRepository);
        expect(await service.execute(updateUserDto)).toBe(void 0);
        expect(userRepository.update).toHaveBeenCalledTimes(1);
        expect(userRepository.find).toHaveBeenCalledTimes(1);
        expect(userRepository.find).toHaveBeenCalledWith(updateUserDto.id);
        expect(userRepository.update).toHaveBeenCalled( );
    });
});