import { Repository } from "typeorm";
import { UserEntity } from "../../../../infrastructure/entities/user/user.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { UserRepository } from "../../../../infrastructure/repositories/user/user.repository";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { FindAllUserService } from './findAll.user.service';
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { RoleEnum } from "@/domain/worker/roleEnum";
import { Person } from "@/domain/@shared/person";
import { mockUser } from "../../../../../tests/mocks/domain/user.mock";
import { AccessType } from "@/domain/user/access.type";

describe('FindAllUserService integration tests', () =>{
    
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

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('entities and repositories must be instantiated', async () =>{
        expect(userEntity).toBeDefined();
        expect(userRepository).toBeDefined();
        expect(workerEntity).toBeDefined();
        expect(workerRepository).toBeDefined();
    });

    it('should find an empty array', async () =>{
        const service = new FindAllUserService(userRepository);
        const results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all.length).toBe(0);
    })

    it('should find two users', async () =>{
        let admin = mockUser(AccessType.ADMIN);
        let teacher = mockUser(AccessType.TEACHER);

        let person = admin.getPerson() as any;
        let person1 = teacher.getPerson() as any;
        let personEntity = WorkerEntity.toWorkerEntity(person);
        let personEntity1 = WorkerEntity.toWorkerEntity(person1);

        expect(await workerRepository.create(personEntity)).toBeInstanceOf(WorkerEntity);
        expect(await workerRepository.create(personEntity1)).toBeInstanceOf(WorkerEntity);

        let adminEntity = UserEntity.toUserEntity(admin);
        let teacherEntity = UserEntity.toUserEntity(teacher);

        expect(await userRepository.create(adminEntity)).toBeInstanceOf(UserEntity);
        expect(await userRepository.create(teacherEntity)).toBeInstanceOf(UserEntity);

        const service = new FindAllUserService(userRepository);

        const results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all.length).toBe(2);
        expect(results.all[0].id).toBe(admin.getId());
        expect(results.all[1].id).toBe(teacher.getId());
    });

});