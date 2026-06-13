import { Repository } from 'typeorm';
import { UserEntity } from "../../../../infrastructure/entities/user/user.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { UserRepository } from "../../../../infrastructure/repositories/user/user.repository";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { UpdateUserDto } from './update.user.dto';
import { UpdateUserService } from './update.user.service';
import { TestDataSource } from '@/infrastructure/repositories/config-test/test.datasource';
import { mockUser } from '../../../../../tests/mocks/domain/user.mock';
import { AccessType } from '@/domain/user/access.type';
import { User } from '@/domain/user/user';
import { UserMapper } from '@/infrastructure/mappers/user/user-mapper';
import { WorkerMapper } from '@/infrastructure/mappers/worker/worker-mapper';
import { Worker } from '@/domain/worker/worker';


describe('UpdateUserService integration test', () => {

    let userRepository: UserRepository;
    let workerRepository: WorkerRepository;

    beforeAll(async () => {
        userRepository = new UserRepository(TestDataSource);
        workerRepository = new WorkerRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('entities and repositories must be instantiated', () => {
        expect(userRepository).toBeDefined();
        expect(workerRepository).toBeDefined();
    });

    it('should thorw an error with id not passed', async () => {
        let user = mockUser(AccessType.TEACHER);
        let person = user.getPerson() as any;
        let personEntity = WorkerMapper.fromDomain(person);
        expect(await workerRepository.create(personEntity)).toBeInstanceOf(Worker);

        let userEntity = UserMapper.fromDomain(user);
        expect(await userRepository.create(userEntity)).toBeInstanceOf(User);

        let wantedId = 'e211c4ba-da05-4d02-8fa0-f5f0a35d4326';
        const service = new UpdateUserService(userRepository);
        let input = new UpdateUserDto(wantedId, '123', 'test', 'test@test');
        try {
            service.execute(input)
        } catch (error) {
            expect(error).toEqual({ errors: [{ context: 'user', message: 'id must be informed' }] });
        }
    });

    it('should throw error if input does not have attributes but id', async () => {
        let user = mockUser(AccessType.TEACHER);
        let person = user.getPerson() as any;
        let personEntity = WorkerMapper.fromDomain(person);
        expect(await workerRepository.create(personEntity)).toBeInstanceOf(Worker);

        let userEntity = UserMapper.fromDomain(user);
        expect(await userRepository.create(userEntity)).toBeInstanceOf(User);

        let wantedId = user.getId();
        const service = new UpdateUserService(userRepository);
        let input = new UpdateUserDto(wantedId);
        await expect(service.execute(input)).rejects.toMatchObject({
            errors: [{ context: 'user', message: 'at least one atribute must be passed to update an user' }],
        });
    });

    it('should update an user', async () => {
        let user = mockUser(AccessType.TEACHER);
        let person = user.getPerson() as any;
        let personEntity = WorkerMapper.fromDomain(person);
        expect(await workerRepository.create(personEntity)).toBeInstanceOf(Worker);

        let userEntity = UserMapper.fromDomain(user);
        expect(await userRepository.create(userEntity)).toBeInstanceOf(User);

        let wantedId = user.getId();
        let userBD = await userRepository.find(wantedId);
        expect(userBD).toBeDefined();

        let input = new UpdateUserDto(wantedId, '123', 'test', 'test@test');
        const service = new UpdateUserService(userRepository);
        expect(await service.execute(input)).toBe(void 0);
        let updatedUser = await userRepository.find(wantedId);
        expect(updatedUser).toBeDefined();
        expect(updatedUser.getId()).toBe(wantedId);
        expect(updatedUser.getEmail()).toBe(input.email);
    });

    it('should not update an user ', async () => {
        let user = mockUser(AccessType.TEACHER);
        let person = user.getPerson() as any;
        let personEntity = WorkerMapper.fromDomain(person);
        expect(await workerRepository.create(personEntity)).toBeInstanceOf(Worker);

        let userEntity = UserMapper.fromDomain(user);
        expect(await userRepository.create(userEntity)).toBeInstanceOf(User);

        let wantedId = 'e211c4ba-da05-4d02-8fa0-f5f0a35d4326';
        let userBD = await userRepository.find(user.getId());
        expect(userBD).toBeDefined();

        let input = new UpdateUserDto(wantedId, 'different', 'test', 'test@test');
        const service = new UpdateUserService(userRepository);
        expect(await service.execute(input)).toBe(void 0);
        let updatedUser = await userRepository.find(user.getId());
        expect(updatedUser).toBeDefined();
        expect(updatedUser.getId()).toBe(user.getId());
        expect(updatedUser.getNickname() == input.nickname).toBeFalsy();
        expect(updatedUser.getEmail() == input.email).toBeFalsy();
    });

});
