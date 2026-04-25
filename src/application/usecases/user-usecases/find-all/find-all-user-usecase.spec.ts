import { FindAllUserDto } from "@/application/services/user/findAll/findAll.user.dto";
import { FindAllUserService } from "@/application/services/user/findAll/findAll.user.service";
import { MockRepositoriesForUnitTest } from "@/infrastructure/__mocks__/mockRepositories"
import { FindAllUserUsecase } from "./find-all-user-usecase";
import { AccessType } from "@/domain/user/access.type";
import { mockUser } from '../../../../../tests/mocks/domain/user.mock';
import { UserEntity } from "@/infrastructure/entities/user/user.entity";

describe('FindAllUserUsecase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should find an empty array', async () => {
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        const all = new FindAllUserDto([]);
        const userService = jest.spyOn(FindAllUserService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(all));
        const usecase = new FindAllUserUsecase(repository);
        const result = await usecase.execute();
        expect(result.all).toHaveLength(0);
        expect(userService).toHaveBeenCalledTimes(1);
    });

    it('should find users', async () => {
        const user1 = mockUser(AccessType.ADMIN);
        const user2 = mockUser(AccessType.TEACHER);
        const userEntity1 = UserEntity.toUserEntity(user1);
        const userEntity2 = UserEntity.toUserEntity(user2);
        const dto = new FindAllUserDto([userEntity1, userEntity2]);
        const userService = jest.spyOn(FindAllUserService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(dto));
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        const usecase = new FindAllUserUsecase(repository);
        const result = await usecase.execute();
        expect(result).toBeDefined();
        expect(result.all).toHaveLength(2)
        expect(result).toBeInstanceOf(FindAllUserDto);
        expect([user1.getId(), user2.getId()].includes(result.all[0].id)).toBeTruthy();
        expect([user1.getId(), user2.getId()].includes(result.all[1].id)).toBeTruthy();
        expect(userService).toHaveBeenCalledTimes(1);
    })
});
