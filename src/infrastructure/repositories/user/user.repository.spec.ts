import { Repository } from 'typeorm';
import { Worker } from '../../../domain/worker/worker';
import { DomainMocks } from "../../__mocks__/mocks";
import { UserEntity } from "../../entities/user/user.entity";
import { WorkerEntity } from "../../entities/worker/worker.entity";
import { UserRepository } from '../user/user.repository';
import { WorkerRepository } from "../worker/worker.repository";
import { TestDataSource } from '../config-test/test.datasource';

describe('UserRepository unit test', () => {

    let userModel: Repository<UserEntity>;
    let userRepository: UserRepository;
    let workerModel: Repository<WorkerEntity>;
    let workerRepository: WorkerRepository;

    beforeAll(async () => {
        userModel = TestDataSource.getRepository(UserEntity);
        userRepository = new UserRepository(TestDataSource);
        workerModel = TestDataSource.getRepository(WorkerEntity);
        workerRepository = new WorkerRepository(TestDataSource);
    });

    it('models e repositories must be instantiated', async () => {
        expect(workerModel).toBeDefined();
        expect(workerRepository).toBeDefined();
        expect(userModel).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    it('should save a user in BD', async () => {
        let user = DomainMocks.mockUserTeacher();
        let worker = user.getPerson() as Worker;
        let model = WorkerEntity.toWorkerEntity(worker);
        expect(await workerRepository.create(model)).toBeInstanceOf(WorkerEntity);

        let wantedid = user.getId();
        let entity = UserEntity.toUserEntity(user);
        expect(await userRepository.create(entity)).toBeInstanceOf(UserEntity);
        let result = await userRepository.find(wantedid);
        expect(result).toBeDefined();
        expect(result.id).toBe(wantedid);
    });

    it('should delete a user in BD', async () => {
        let user = DomainMocks.mockUserTeacher();
        let worker = user.getPerson() as Worker;
        let model = WorkerEntity.toWorkerEntity(worker);
        expect(await workerRepository.create(model)).toBeInstanceOf(WorkerEntity);

        let wantedid = user.getId();
        let entity = UserEntity.toUserEntity(user);
        expect(await userRepository.create(entity)).toBeInstanceOf(UserEntity)

        let result = await userRepository.find(wantedid);
        expect(result).toBeDefined();

        expect(await userRepository.delete(wantedid)).toBe(void 0);
        result = await userRepository.find(wantedid);

        expect(result).toBeNull();
    });

    it('should find a user in BD', async () => {
        let user = DomainMocks.mockUserTeacher();
        let worker = user.getPerson() as Worker;
        let model = WorkerEntity.toWorkerEntity(worker);
        expect(await workerRepository.create(model)).toBeInstanceOf(WorkerEntity);

        let wantedid = user.getId();
        let entity = UserEntity.toUserEntity(user);
        let result = await userRepository.find(wantedid);
        expect(result).toBeNull();
        expect(await userRepository.create(entity)).toBeInstanceOf(UserEntity);

        result = await userRepository.find(wantedid);
        expect(result).toBeDefined();

    })

    it('should find all users in BD', async () => {
        let user = DomainMocks.mockUserAdmin();
        let user1 = DomainMocks.mockUserTeacher();

        let worker = user.getPerson() as Worker;
        let model = WorkerEntity.toWorkerEntity(worker);
        expect(await workerRepository.create(model)).toBeInstanceOf(WorkerEntity);

        let worker1 = user1.getPerson() as Worker;
        let model1 = WorkerEntity.toWorkerEntity(worker1);
        expect(await workerRepository.create(model1)).toBeInstanceOf(WorkerEntity);

        let entity = UserEntity.toUserEntity(user);
        let entity1 = UserEntity.toUserEntity(user1);
        expect(await userRepository.create(entity)).toBeInstanceOf(UserEntity);
        expect(await userRepository.create(entity1)).toBeInstanceOf(UserEntity);

        let results = await userRepository.findAll();
        expect(results).toBeDefined();
        expect(results.length).toBe(2);
        expect(results[0].person).toBeDefined();
        expect(results[1].person).toBeDefined();
    });

    it('should update an user in BD', async () => {
        let user = DomainMocks.mockUserTeacher();
        let worker = user.getPerson() as Worker;
        let model = WorkerEntity.toWorkerEntity(worker);
        expect(await workerRepository.create(model)).toBeInstanceOf(WorkerEntity);

        let wantedid = user.getId();

        let entity = UserEntity.toUserEntity(user);
        expect(await userRepository.create(entity)).toBeInstanceOf(UserEntity);

        let fromBD = await userRepository.find(wantedid);
        let wantedNickname = 'new nickname'
        fromBD.nickname = wantedNickname;
        expect(await userRepository.update(fromBD)).toBe(void 0);
        fromBD = await userRepository.find(wantedid);
        expect(fromBD).toBeDefined();
        expect(fromBD.nickname).toEqual(wantedNickname);
    });

});
