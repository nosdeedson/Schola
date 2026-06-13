import { Repository } from "typeorm";
import { UserEntity } from "../../../../infrastructure/entities/user/user.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { UserRepository } from "../../../../infrastructure/repositories/user/user.repository";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { DeleteUserService } from './delete.user.service';
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { mockUser } from "../../../../../tests/mocks/domain/user.mock";
import { AccessType } from "@/domain/user/access.type";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";
import { UserMapper } from "@/infrastructure/mappers/user/user-mapper";
import { User } from "@/domain/user/user";
import { Worker } from "@/domain/worker/worker";


describe('service delete user integration tests', () => {

    let userRepository: UserRepository;
    let personRepository: WorkerRepository;

    beforeAll(async () => {
        userRepository = new UserRepository(TestDataSource);
        personRepository = new WorkerRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('entities and repositories must be instantiated', () => {
        expect(userRepository).toBeDefined();
        expect(personRepository).toBeDefined();
    });

    it('should delete an user', async () => {
        personRepository = new WorkerRepository(TestDataSource);
        let person = mockWorker();
        let teacherEntity = WorkerMapper.fromDomain(person);
        let userInput = mockUser(AccessType.TEACHER);
        let user = UserMapper.fromDomain(userInput);
        user.person = teacherEntity;
        expect(await personRepository.create(teacherEntity)).toBeInstanceOf(Worker);
        expect(await userRepository.create(user)).toBeInstanceOf(User);
        let wantedId = user.id;
        let userBD = await userRepository.find(wantedId);
        expect(userBD).toBeDefined();
        const service = new DeleteUserService(userRepository);
        expect(await service.execute(wantedId));
        userBD = await userRepository.find(wantedId);
        expect(userBD).toBeNull();
    });


    it('should not delete an user', async () => {
        personRepository = new WorkerRepository(TestDataSource);
        let person = mockWorker();
        let teacherEntity = WorkerMapper.fromDomain(person);
        let userInput = mockUser(AccessType.TEACHER);
        let user = UserMapper.fromDomain(userInput);
        user.person = teacherEntity;
        expect(await personRepository.create(teacherEntity)).toBeInstanceOf(Worker);
        expect(await userRepository.create(user)).toBeInstanceOf(User);
        let userBD = await userRepository.find(user.id);
        expect(userBD).toBeDefined();
        const service = new DeleteUserService(userRepository);
        let wrongId = '4c4179a7-9d83-429e-b96f-1108b480c038';
        expect(await service.execute(wrongId)).toBe(void 0);
        let afterDeleting = await userRepository.find(user.id);
        expect(afterDeleting).toBeDefined();
    });

});
