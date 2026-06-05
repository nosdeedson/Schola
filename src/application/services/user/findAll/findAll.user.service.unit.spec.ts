import { AccessType } from "@/domain/user/access.type";
import { mockUser } from "../../../../../tests/mocks/domain/user.mock";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { UserEntity } from "../../../../infrastructure/entities/user/user.entity";
import { FindAllUserService } from './findAll.user.service';


describe('FindAllUserService unit test', () =>{

    afterEach(() =>{
        jest.clearAllMocks();
    })

    it('should find empty array of users', async () =>{
        const userRepository = MockRepositoriesForUnitTest.mockRepositories();
        userRepository.findAll = jest.fn().mockImplementationOnce(() => {
            return [];
        });
        const service = new FindAllUserService(userRepository);
        let results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all.length).toBe(0);
        expect(userRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should find two users', async () =>{
        let admin = mockUser(AccessType.ADMIN);
        let teacher = mockUser(AccessType.TEACHER);
        let adminEntity = UserEntity.toUserEntity(admin)
        let teacherEntity = UserEntity.toUserEntity(teacher);
        const userRepository = MockRepositoriesForUnitTest.mockRepositories();
        userRepository.findAll = jest.fn().mockImplementationOnce(() => {
            return [ adminEntity, teacherEntity];
        });
        const service = new FindAllUserService(userRepository);
        let results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all.length).toBe(2);
        expect(userRepository.findAll).toHaveBeenCalledTimes(1);
        expect(results.all[0].id).toBeDefined();
        expect(results.all[1].id).toBeDefined();
    });
});