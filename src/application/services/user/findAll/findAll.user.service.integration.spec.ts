import { Repository } from "typeorm";
import { UserEntity } from "../../../../infrastructure/entities/user/user.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { UserRepository } from "../../../../infrastructure/repositories/user/user.repository";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { FindAllUserService } from './findAll.user.service';
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockUser } from "../../../../../tests/mocks/domain/user.mock";
import { AccessType } from "@/domain/user/access.type";
import { UserMapper } from "@/infrastructure/mappers/user/user-mapper";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";
import { Worker } from "@/domain/worker/worker";
import { User } from "@/domain/user/user";

describe('FindAllUserService integration tests', () => {

    let userRepository: UserRepository;
    let workerRepository: WorkerRepository;

    beforeAll(async () => {
        userRepository = new UserRepository(TestDataSource);
        workerRepository = new WorkerRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('entities and repositories must be instantiated', async () => {
        expect(userRepository).toBeDefined();
        expect(workerRepository).toBeDefined();
    });

    it('should find an empty array', async () => {
        const service = new FindAllUserService(userRepository);
        const results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all.length).toBe(0);
    })

    it('should find two users', async () => {
        let admin = mockUser(AccessType.ADMIN);
        let teacher = mockUser(AccessType.TEACHER);

        let person = admin.getPerson() as any;
        let person1 = teacher.getPerson() as any;
        let personEntity = WorkerMapper.fromDomain(person);
        let personEntity1 = WorkerMapper.fromDomain(person1);

        expect(await workerRepository.create(personEntity)).toBeInstanceOf(Worker);
        expect(await workerRepository.create(personEntity1)).toBeInstanceOf(Worker);

        let adminEntity = UserMapper.fromDomain(admin);
        let teacherEntity = UserMapper.fromDomain(teacher);

        expect(await userRepository.create(adminEntity)).toBeInstanceOf(User);
        expect(await userRepository.create(teacherEntity)).toBeInstanceOf(User);

        const service = new FindAllUserService(userRepository);

        const results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all.length).toBe(2);
        expect(results.all[0].id).toBe(admin.getId());
        expect(results.all[1].id).toBe(teacher.getId());
    });

});
