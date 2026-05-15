import { Repository } from "typeorm";
import { UserEntity } from "../../../../infrastructure/entities/user/user.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { UserRepository } from "../../../../infrastructure/repositories/user/user.repository";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { DeleteUserService } from './delete.user.service';
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { mockUser } from "../../../../../tests/mocks/domain/user.mock";
import { AccessType } from "@/domain/user/access.type";


describe('service delete user integration tests', () => {

    let userEntity: Repository<UserEntity>;
    let userRepository: UserRepository;

    let personEntity: Repository<WorkerEntity>;
    let personRepository: WorkerRepository;

    beforeAll(async () =>{
        
        userEntity = TestDataSource.getRepository(UserEntity);
        userRepository = new UserRepository(TestDataSource);

        personEntity = TestDataSource.getRepository(WorkerEntity);
        personRepository = new WorkerRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('entities and repositories must be instantiated', () =>{
        expect(userEntity).toBeDefined();
        expect(userRepository).toBeDefined();
        expect(personEntity).toBeDefined();
        expect(personRepository).toBeDefined();
    });

    it('should delete an user', async () =>{
        personRepository = new WorkerRepository(TestDataSource); 
        let person = mockWorker();
        let teacherEntity = WorkerEntity.toWorkerEntity(person);
        let userInput = mockUser(AccessType.TEACHER);
        let user = UserEntity.toUserEntity(userInput);
        user.person = teacherEntity;
        expect(await personRepository.create(teacherEntity)).toBeInstanceOf(WorkerEntity);
        expect(await userRepository.create(user)).toBeInstanceOf(UserEntity);
        let wantedId = user.id;
        let userBD = await userRepository.find(wantedId);
        expect(userBD).toBeDefined();
        const service = new DeleteUserService(userRepository);
        expect(await service.execute(wantedId));
        userBD = await userRepository.find(wantedId);
        expect(userBD).toBeNull();
    });
   

    it('should not delete an user', async () =>{
        personRepository = new WorkerRepository(TestDataSource); 
        let person = mockWorker();
        let teacherEntity = WorkerEntity.toWorkerEntity(person);
        let userInput = mockUser(AccessType.TEACHER);
        let user = UserEntity.toUserEntity(userInput);
        user.person = teacherEntity;
        expect(await personRepository.create(teacherEntity)).toBeInstanceOf(WorkerEntity);
        expect(await userRepository.create(user)).toBeInstanceOf(UserEntity);
        let userBD = await userRepository.find(user.id);
        expect(userBD).toBeDefined();
        const service = new DeleteUserService(userRepository);
        let wrongId = '4c4179a7-9d83-429e-b96f-1108b480c038';
        expect(await service.execute(wrongId)).toBe(void 0);
        let afterDeleting = await userRepository.find(user.id);
        expect(afterDeleting).toBeDefined();
    });

})