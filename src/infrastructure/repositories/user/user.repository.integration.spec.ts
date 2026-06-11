import { Repository } from 'typeorm';
import { Worker } from '../../../domain/worker/worker';
import { UserEntity } from "../../entities/user/user.entity";
import { WorkerEntity } from "../../entities/worker/worker.entity";
import { UserRepository } from '../user/user.repository';
import { WorkerRepository } from "../worker/worker.repository";
import { TestDataSource } from '../config-test/test.datasource';
import { mockUser } from '../../../../tests/mocks/domain/user.mock';
import { AccessType } from '@/domain/user/access.type';
import { WorkerMapper } from '@/infrastructure/mappers/worker/worker-mapper';
import { UserMapper } from '@/infrastructure/mappers/user/user-mapper';
import { User } from '@/domain/user/user';

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
        let user = mockUser(AccessType.TEACHER);
        let worker = user.getPerson() as Worker;
        let model = WorkerMapper.fromDomain(worker);
        expect(await workerRepository.create(model)).toBeInstanceOf(Worker);

        let wantedid = user.getId();
        let entity = UserMapper.fromDomain(user);
        expect(await userRepository.create(entity)).toBeInstanceOf(User);
        let result = await userRepository.find(wantedid);
        expect(result).toBeDefined();
        expect(result.getId()).toBe(wantedid);
    });

    it('should delete a user in BD', async () => {
        let user = mockUser(AccessType.TEACHER);
        let worker = user.getPerson() as Worker;
        let model = WorkerMapper.fromDomain(worker);
        expect(await workerRepository.create(model)).toBeInstanceOf(Worker);

        let wantedid = user.getId();
        let entity = UserMapper.fromDomain(user);
        expect(await userRepository.create(entity)).toBeInstanceOf(User)

        let result = await userRepository.find(wantedid);
        expect(result).toBeDefined();

        expect(await userRepository.delete(wantedid)).toBe(void 0);
        result = await userRepository.find(wantedid);

        expect(result).toBeNull();
    });

    it('should find a user in BD', async () => {
        let user = mockUser(AccessType.TEACHER);
        let worker = user.getPerson() as Worker;
        let model = WorkerMapper.fromDomain(worker);
        expect(await workerRepository.create(model)).toBeInstanceOf(Worker);

        let wantedid = user.getId();
        let entity = UserMapper.fromDomain(user);
        let result = await userRepository.find(wantedid);
        expect(result).toBeNull();
        expect(await userRepository.create(entity)).toBeInstanceOf(User);

        result = await userRepository.find(wantedid);
        expect(result).toBeDefined();
    });

    it('should find all users in BD', async () => {
        let user = mockUser(AccessType.ADMIN);
        let user1 = mockUser(AccessType.TEACHER);

        let worker = user.getPerson() as Worker;
        let model = WorkerMapper.fromDomain(worker);
        expect(await workerRepository.create(model)).toBeInstanceOf(Worker);

        let worker1 = user1.getPerson() as Worker;
        let model1 = WorkerMapper.fromDomain(worker1);
        expect(await workerRepository.create(model1)).toBeInstanceOf(Worker);

        let entity = UserMapper.fromDomain(user);
        let entity1 = UserMapper.fromDomain(user1);
        expect(await userRepository.create(entity)).toBeInstanceOf(User);
        expect(await userRepository.create(entity1)).toBeInstanceOf(User);

        let results = await userRepository.findAll();
        expect(results).toBeDefined();
        expect(results.length).toBe(2);
        expect(results[0].getPerson()).toBeDefined();
        expect(results[1].getPerson()).toBeDefined();
    });

    it('should update an user in BD', async () => {
        let user = mockUser(AccessType.TEACHER);
        let worker = user.getPerson() as Worker;
        let model = WorkerMapper.fromDomain(worker);
        expect(await workerRepository.create(model)).toBeInstanceOf(Worker);

        let wantedid = user.getId();

        let entity = UserMapper.fromDomain(user);
        expect(await userRepository.create(entity)).toBeInstanceOf(User);

        let fromBD = await userRepository.find(wantedid);
        let wantedNickname = 'new nickname'
        fromBD.setNickanme(wantedNickname);
        expect(await userRepository.update(UserMapper.fromDomain(fromBD))).toBe(void 0);
        fromBD = await userRepository.find(wantedid);
        expect(fromBD).toBeDefined();
        expect(fromBD.getNickname()).toEqual(wantedNickname);
    });

});
