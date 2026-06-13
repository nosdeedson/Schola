import { AccessType } from "@/domain/user/access.type";
import { mockUser } from "../../../../../tests/mocks/domain/user.mock";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { UserEntity } from "../../../../infrastructure/entities/user/user.entity";
import { UpdateUserDto } from './update.user.dto';
import { UpdateUserService } from './update.user.service';
import { UserMapper } from "@/infrastructure/mappers/user/user-mapper";


describe('UpdateUserService unit tests', () => {

    let updateUserDto: UpdateUserDto;
    let userRepository: any;

    beforeEach(() => {
        userRepository = MockRepositoriesForUnitTest.mockRepositories();
    });

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('should throw an error because id is not present ', async () => {
        let input = { email: 'test@test', nickname: 'test', password: '4321' };

        const service = new UpdateUserService(userRepository);
        await expect(service.execute(input as UpdateUserDto)).rejects
            .toMatchObject({
                errors: [
                    { context: 'user', message: 'id must be informed' }
                ]
            });
    });

    it('should throw an error because dto has just the id ', async () => {
        let input = { id: '4321' };
        const service = new UpdateUserService(userRepository);
        await expect(service.execute(input as UpdateUserDto)).rejects
            .toMatchObject({
                errors: [
                    { context: 'user', message: 'at least one atribute must be passed to update an user' }
                ]
            });
    });

    it('should update an user', async () => {
        const user = mockUser(AccessType.TEACHER);
        updateUserDto = { id: user.getId(), email: 'test@test', nickname: 'test', password: '4321' };
        userRepository.find = jest.fn().mockImplementationOnce(() => { return user });
        userRepository.update = jest.fn().mockImplementationOnce(() => { void 0 })
        const service = new UpdateUserService(userRepository);
        expect(await service.execute(updateUserDto)).toBe(void 0);
        expect(userRepository.update).toHaveBeenCalledTimes(1);
        expect(userRepository.find).toHaveBeenCalledTimes(1);
        expect(userRepository.find).toHaveBeenCalledWith(updateUserDto.id);
        expect(userRepository.update).toHaveBeenCalled();
    });
});
