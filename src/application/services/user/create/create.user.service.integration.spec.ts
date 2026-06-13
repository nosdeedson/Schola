import { AccessType } from "../../../../domain/user/access.type";
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
import { QueryFailedError, Repository } from "typeorm";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { RoleEnum } from "@/domain/worker/roleEnum";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { mockParent } from "../../../../../tests/mocks/domain/parent.mocks";
import { ParentMapper } from "@/infrastructure/mappers/parent/parent-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";
import { Worker } from "@/domain/worker/worker";
import { Parent } from "@/domain/parent/parent";
import { Student } from "@/domain/student/student";

describe('create user service integration tests', () => {

    let userRepository: UserRepository;
    let personRepository: any;

    beforeAll(async () => {
        userRepository = new UserRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('user entity and repository should be instantiated', async () => {
        expect(userRepository).toBeDefined();
    });

    it('should create an user of type teacher', async () => {

        personRepository = new WorkerRepository(TestDataSource);
        let person = mockWorker();
        let teacherEntity = WorkerMapper.fromDomain(person);
        expect(await personRepository.create(teacherEntity)).toBeInstanceOf(Worker);

        let input = {
            person: teacherEntity,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.TEACHER
        };

        const service = new CreateUserService(userRepository, personRepository);
        expect(await service.execute(input)).toBe(void 0);

        let results = await userRepository.findAll();
        expect(results.length).toBe(1);
        expect(results[0].getId()).toBeDefined();
    });

    it('should create an user of type admin', async () => {

        personRepository = new WorkerRepository(TestDataSource);
        let person = mockWorker({ role: RoleEnum.ADMINISTRATOR });
        let workerAdmin = WorkerMapper.fromDomain(person);
        expect(await personRepository.create(workerAdmin)).toBeInstanceOf(Worker);

        let input = {
            person: workerAdmin,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.ADMIN
        };

        const service = new CreateUserService(userRepository, personRepository);
        expect(await service.execute(input)).toBe(void 0);

        let results = await userRepository.findAll();
        expect(results.length).toBe(1);
        expect(results[0].getId()).toBeDefined();
    });

    it('should create an user of type student', async () => {

        let studentRepository = new StudentRepository(TestDataSource);

        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);

        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let input = {
            person: studentEntity,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.STUDENT
        };

        const service = new CreateUserService(userRepository, studentRepository);
        expect(await service.execute(input)).toBe(void 0);

        let results = await userRepository.findAll();
        expect(results.length).toBe(1);
        expect(results[0].getId()).toBeDefined();
    });

    it('should create an user of type parent', async () => {

        let parentRepository = new ParentRepository(TestDataSource);

        let parent = mockParent();
        let parentEntity = ParentMapper.fromDomain(parent);

        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(Parent);

        let input = {
            person: parentEntity,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.PARENT
        };

        const service = new CreateUserService(userRepository, parentRepository);
        expect(await service.execute(input)).toBe(void 0);

        let results = await userRepository.findAll();
        expect(results.length).toBe(1);
        expect(results[0].getId()).toBeDefined();
    });

    it('should throw an QueryFailedError', async () => {

        personRepository = new WorkerRepository(TestDataSource);
        let person = mockWorker();
        let teacherEntity = WorkerMapper.fromDomain(person);
        // expect(await personRepository.create(teacherEntity)).toBeInstanceOf(Worker);

        let input = {
            person: teacherEntity,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.TEACHER
        };

        const service = new CreateUserService(userRepository, personRepository);
        await expect(service.execute(input)).rejects.toThrow(QueryFailedError);
    });
});
