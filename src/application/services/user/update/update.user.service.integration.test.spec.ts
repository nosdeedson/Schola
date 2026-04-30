import { Repository } from 'typeorm';
import { User } from "../../../../domain/user/user";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { UserEntity } from "../../../../infrastructure/entities/user/user.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { UserRepository } from "../../../../infrastructure/repositories/user/user.repository";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { UpdateUserDto } from './update.user.dto';
import { UpdateUserService } from './update.user.service';
import { TestDataSource } from '@/infrastructure/repositories/config-test/test.datasource';


describe('UpdateUserService integration test', () =>{

    let userEntity: Repository<UserEntity>;
    let userRepository: UserRepository;
    let user: User;

    let workerEntity: Repository<WorkerEntity>;
    let workerRepository: WorkerRepository;

    beforeAll(async () =>{

        user = DomainMocks.mockUserTeacher();
        
        userEntity = TestDataSource.getRepository(UserEntity);
        userRepository = new UserRepository(userEntity, TestDataSource);

        workerEntity = TestDataSource.getRepository(WorkerEntity);
        workerRepository = new WorkerRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('entities and repositories must be instantiated', () =>{
        expect(userEntity).toBeDefined();
        expect(userRepository).toBeDefined();
        expect(workerEntity).toBeDefined();
        expect(workerRepository).toBeDefined();
    });

    it('should thorw an error with id not passed', async () =>{
        
        let person = user.getPerson() as any;
        let personEntity = WorkerEntity.toWorkerEntity(person);
        expect(await workerRepository.create(personEntity)).toBeInstanceOf(WorkerEntity);
        
        let userEntity = UserEntity.toUserEntity(user);
        expect(await userRepository.create(userEntity)).toBeInstanceOf(UserEntity);
        
        let wantedId = 'e211c4ba-da05-4d02-8fa0-f5f0a35d4326';
        const service = new UpdateUserService(userRepository);
        let input = new UpdateUserDto(wantedId, '123', 'test', 'test@test');
        try {
            service.execute(input)
        } catch (error) {
            expect(error).toEqual({errors :[{context: 'user', message: 'id must be informed'}]});
        }
    });

    it('should throw error if input does not have attributes but id', async () =>{
        
        let person = user.getPerson() as any;
        let personEntity = WorkerEntity.toWorkerEntity(person);
        expect(await workerRepository.create(personEntity)).toBeInstanceOf(WorkerEntity);
        
        let userEntity = UserEntity.toUserEntity(user);
        expect(await userRepository.create(userEntity)).toBeInstanceOf(UserEntity);
        
        let wantedId = user.getId();
        const service = new UpdateUserService(userRepository);
        let input = new UpdateUserDto(wantedId);
        try {
            await service.execute(input)
        } catch (error) {
            expect(error).toEqual({errors: [{context: 'user', message: 'at least one atribute must be passed to update an user'}]});
            //@ts-ignore
            expect(error.errors[0].message).toBe('at least one atribute must be passed to update an user');
        }
    });

    it('should update an user', async () =>{
        
        let person = user.getPerson() as any;
        let personEntity = WorkerEntity.toWorkerEntity(person);
        expect(await workerRepository.create(personEntity)).toBeInstanceOf(WorkerEntity);
        
        let userEntity = UserEntity.toUserEntity(user);
        expect(await userRepository.create(userEntity)).toBeInstanceOf(UserEntity);
        
        let wantedId = user.getId();
        let userBD = await userRepository.find(wantedId);
        expect(userBD).toBeDefined();

        let input = new UpdateUserDto(wantedId, '123', 'test', 'test@test');
        const service = new UpdateUserService(userRepository);
        expect(await service.execute(input)).toBe(void 0);
        let updatedUser = await userRepository.find(wantedId);
        expect(updatedUser).toBeDefined();
        expect(updatedUser.id).toBe(wantedId);
        expect(updatedUser.password).toBe(input.password);
        expect(updatedUser.nickname).toBe(input.nickname);
        expect(updatedUser.email).toBe(input.email);
    });

    it('should not update an user ', async () =>{
        
        let person = user.getPerson() as any;
        let personEntity = WorkerEntity.toWorkerEntity(person);
        expect(await workerRepository.create(personEntity)).toBeInstanceOf(WorkerEntity);
        
        let userEntity = UserEntity.toUserEntity(user);
        expect(await userRepository.create(userEntity)).toBeInstanceOf(UserEntity);
        
        let wantedId = 'e211c4ba-da05-4d02-8fa0-f5f0a35d4326';
        let userBD = await userRepository.find(user.getId());
        expect(userBD).toBeDefined();

        let input = new UpdateUserDto(wantedId, 'different', 'test', 'test@test');
        const service = new UpdateUserService(userRepository);
        expect(await service.execute(input)).toBe(void 0);
        let updatedUser = await userRepository.find(user.getId());
        expect(updatedUser).toBeDefined();
        expect(updatedUser.id).toBe(user.getId());
        expect(updatedUser.password == input.password).toBeFalsy();
        expect(updatedUser.nickname == input.nickname).toBeFalsy();
        expect(updatedUser.email == input.email).toBeFalsy();
    });

});