import { Repository } from "typeorm";
import { UserEntity } from "../../../../infrastructure/entities/user/user.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { UserRepository } from "../../../../infrastructure/repositories/user/user.repository";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { FindUserService } from "./find.user.service";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockUser } from "../../../../../tests/mocks/domain/user.mock";
import { AccessType } from "@/domain/user/access.type";
import { User } from "@/domain/user/user";
import { UserMapper } from "@/infrastructure/mappers/user/user-mapper";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";
import { Worker } from "@/domain/worker/worker";

describe('find user integration unit test', () => {

    let userRepository: UserRepository;
    let workerRepository: WorkerRepository;

    beforeAll(async () => {
        userRepository = new UserRepository(TestDataSource);
        workerRepository = new WorkerRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('user entity and repository should be instantiated', async () => {
        expect(userRepository).toBeDefined();
        expect(workerRepository).toBeDefined();
    })

    it('given a valid id should find an user', async () => {
        let user = mockUser(AccessType.TEACHER);
        let person = user.getPerson() as any;
        let worker = WorkerMapper.fromDomain(person);
        expect(await workerRepository.create(worker)).toBeInstanceOf(Worker);

        let userSave = UserMapper.fromDomain(user);

        expect(await userRepository.create(userSave)).toBeInstanceOf(User);
        let wantedId = userSave.id;
        const service = new FindUserService(userRepository);
        let result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toBe(wantedId);
    });

    it('given an invalid id should not find an user', async () => {
        let wantedId = 'f08a20a6-dc13-4e85-b716-3efefecd247a';
        let user = mockUser(AccessType.TEACHER);
        let person = user.getPerson() as any;
        let worker = WorkerMapper.fromDomain(person);
        expect(await workerRepository.create(worker)).toBeInstanceOf(Worker);;

        let userSave = UserMapper.fromDomain(user);

        expect(await userRepository.create(userSave)).toBeInstanceOf(User);
        const service = new FindUserService(userRepository);
        await expect(service.execute(wantedId)).rejects
            .toMatchObject({ errors: [{ context: 'user', message: 'user not found' }] });
    });

});
