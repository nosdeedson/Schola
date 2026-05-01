import { Repository } from "typeorm";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { UserEntity } from "../../../../infrastructure/entities/user/user.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { UserRepository } from "../../../../infrastructure/repositories/user/user.repository";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { FindUserService } from "./find.user.service";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";

describe('find user integration unit test', () =>{

    let userEntity: Repository<UserEntity>;
    let userRepository: UserRepository;
    
    let workerEntity: Repository<WorkerEntity>;
    let workerRepository: WorkerRepository;

    beforeAll(async () =>{
        userEntity = TestDataSource.getRepository(UserEntity);
        userRepository = new UserRepository(TestDataSource);

        workerEntity = TestDataSource.getRepository(WorkerEntity);
        workerRepository = new WorkerRepository(TestDataSource);
    });

    afterEach(async () =>{
        jest.clearAllMocks();
    });

    it('user entity and repository should be instantiated', async () =>{
        expect(userEntity).toBeDefined();
        expect(userRepository).toBeDefined();
        expect(workerEntity).toBeDefined();
        expect(workerRepository).toBeDefined();
    })

    it('given a valid id should find an user', async () =>{
        let user = DomainMocks.mockUserTeacher();
        let person = user.getPerson() as any;
        let worker = WorkerEntity.toWorkerEntity(person);
        expect(await workerRepository.create(worker)).toBeInstanceOf(WorkerEntity);;

        let userSave = UserEntity.toUserEntity(user);
        
        expect(await userRepository.create(userSave)).toBeInstanceOf(UserEntity);
        let wantedId = userSave.id;
        const service = new FindUserService(userRepository);
        let result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toBe(wantedId);
    });

    it('given an invalid id should not find an user', async () =>{
        let wantedId = 'f08a20a6-dc13-4e85-b716-3efefecd247a';
        let user = DomainMocks.mockUserTeacher();
        let person = user.getPerson() as any;
        let worker = WorkerEntity.toWorkerEntity(person);
        expect(await workerRepository.create(worker)).toBeInstanceOf(WorkerEntity);;

        let userSave = UserEntity.toUserEntity(user);
        
        expect(await userRepository.create(userSave)).toBeInstanceOf(UserEntity);
        const service = new FindUserService(userRepository);
        try {
            await service.execute(wantedId);
        } catch (error) {
            expect(error).toBeDefined();
            //@ts-ignore
            expect(error.errors).toMatchObject([{context: 'user', message: 'user not found'}]);
        }
    });

});