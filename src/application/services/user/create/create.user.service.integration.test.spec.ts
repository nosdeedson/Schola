import { AccessType } from "../../../../domain/user/access.type";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { PersonEntity } from "../../../../infrastructure/entities/@shared/person.entity";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { UserEntity } from "../../../../infrastructure/entities/user/user.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { UserRepository } from "../../../../infrastructure/repositories/user/user.repository";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { CreateUserService } from "./create.user.service";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { Repository } from "typeorm";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";

describe('create user service integration tests', () => {

    let userEntity: Repository<UserEntity>;
    let userRepository: UserRepository;

    let personEntity: Repository<any>;
    let personRepository: any;

    beforeAll(async () => {
        userEntity = TestDataSource.getRepository(UserEntity);
        userRepository = new UserRepository(userEntity, TestDataSource);
        personEntity = TestDataSource.getRepository(PersonEntity);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('user entity and repository should be instantiated', async () => {
        expect(userEntity).toBeDefined();
        expect(userRepository).toBeDefined();
        expect(personEntity).toBeDefined();
    })

    it('should create an user of type teacher', async () => {

        personRepository = new WorkerRepository(personEntity, TestDataSource);
        let person = DomainMocks.mockWorker(RoleEnum.TEACHER);
        let teacherEntity = WorkerEntity.toWorkerEntity(person);
        expect(await personRepository.create(teacherEntity)).toBeInstanceOf(WorkerEntity);

        let input = {
            personId: person.getId(),
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.TEACHER
        };

        const service = new CreateUserService(userRepository, personRepository);
        expect(await service.execute(input)).toBe(void 0);

        let results = await userRepository.findAll();
        expect(results.length).toBe(1);
        expect(results[0].id).toBeDefined();
    });

    it('should create an user of type admin', async () => {

        personRepository = new WorkerRepository(personEntity, TestDataSource);
        let person = DomainMocks.mockWorker(RoleEnum.ADMINISTRATOR);
        let workerAdmin = WorkerEntity.toWorkerEntity(person);
        expect(await personRepository.create(workerAdmin)).toBeInstanceOf(WorkerEntity);

        let input = {
            personId: person.getId(),
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.ADMIN
        };

        const service = new CreateUserService(userRepository, personRepository);
        expect(await service.execute(input)).toBe(void 0);

        let results = await userRepository.findAll();
        expect(results.length).toBe(1);
        expect(results[0].id).toBeDefined();
    });

    it('should create an user of type student', async () => {

        let studentRepository = new StudentRepository(personEntity, TestDataSource);

        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);

        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let input = {
            personId: student.getId(),
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.STUDENT
        };

        const service = new CreateUserService(userRepository, studentRepository);
        expect(await service.execute(input)).toBe(void 0);

        let results = await userRepository.findAll();
        expect(results.length).toBe(1);
        expect(results[0].id).toBeDefined();
    });

    it('should create an user of type parent', async () => {

        let parentRepository = new ParentRepository(personEntity, TestDataSource);

        let parent = DomainMocks.mockParent();
        let parentEntity = ParentEntity.toParentEntity(parent);

        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(ParentEntity);

        let input = {
            personId: parent.getId(),
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.PARENT
        };

        const service = new CreateUserService(userRepository, parentRepository);
        expect(await service.execute(input)).toBe(void 0);

        let results = await userRepository.findAll();
        expect(results.length).toBe(1);
        expect(results[0].id).toBeDefined();
    });
});
