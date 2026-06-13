import { AccessType } from "../../../../domain/user/access.type";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { CreateUserService } from './create.user.service';
import { InputCreateUserDto } from "./input.create.user.dto";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { mockParent } from "../../../../../tests/mocks/domain/parent.mocks";
import { QueryFailedError } from "typeorm";
import { ParentMapper } from "@/infrastructure/mappers/parent/parent-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";


describe('create user service unit test', () => {

    let input: InputCreateUserDto;

    afterEach(() => {
        jest.clearAllMocks()
    });

    it('should create an user of type teacher', async () => {
        const person = mockWorker();
        const personEntity = WorkerMapper.fromDomain(person);
        input = {
            person: personEntity,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.TEACHER
        };
        const createUserservice = jest.spyOn(CreateUserService.prototype, 'typePerson')
            .mockImplementationOnce(() => { return person });
        const userRepository = MockRepositoriesForUnitTest.mockRepositories();
        const personRepository = MockRepositoriesForUnitTest.mockRepositories();
        personRepository.find = jest.fn().mockReturnValueOnce(() => personEntity);
        const service = new CreateUserService(userRepository, personRepository);
        expect(await service.execute(input)).toBe(void 0);
        expect(createUserservice).toHaveBeenCalled()
    });

    it('should create an user of type admin', async () => {
        const person = mockWorker({ role: RoleEnum.ADMINISTRATOR });
        const personEntity = WorkerMapper.fromDomain(person);
        input = {
            person: personEntity,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.ADMIN
        };
        const typePerson = jest.spyOn(CreateUserService.prototype, 'typePerson')
            .mockImplementationOnce(() => { return person });
        const userRepository = MockRepositoriesForUnitTest.mockRepositories();
        const personRepository = MockRepositoriesForUnitTest.mockRepositories();
        personRepository.find = jest.fn().mockReturnValueOnce(() => personEntity);
        const service = new CreateUserService(userRepository, personRepository);
        expect(await service.execute(input)).toBe(void 0);
        expect(typePerson).toHaveBeenCalled();
    });

    it('should create an user of type student', async () => {
        const person = mockStudent();
        const personEntity = StudentMapper.fromDomain(person);
        input = {
            person: personEntity,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.STUDENT
        };


        const typePerson = jest.spyOn(CreateUserService.prototype, 'typePerson')
            .mockImplementationOnce(() => { return person });

        const userRepository = MockRepositoriesForUnitTest.mockRepositories();
        const personRepository = MockRepositoriesForUnitTest.mockRepositories();

        personRepository.find = jest.fn().mockReturnValueOnce(() => personEntity);

        const service = new CreateUserService(userRepository, personRepository);

        expect(await service.execute(input)).toBe(void 0);
        expect(typePerson).toHaveBeenCalled();
    });

    it('should create an user of type parent', async () => {
        const person = mockParent();
        const personEntity = ParentMapper.fromDomain(person);
        input = {
            person: personEntity,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.PARENT
        };
        const typePerson = jest.spyOn(CreateUserService.prototype, 'typePerson')
            .mockImplementationOnce(() => { return person });

        const userRepository = MockRepositoriesForUnitTest.mockRepositories();
        const personRepository = MockRepositoriesForUnitTest.mockRepositories();

        personRepository.find = jest.fn().mockReturnValueOnce(() => personEntity);

        const service = new CreateUserService(userRepository, personRepository);

        expect(await service.execute(input)).toBe(void 0);
        expect(typePerson).toHaveBeenCalled();
    });

    it('should throw an QueryFailedError while saving a user', async () => {
        const person = mockWorker();
        const personEntity = WorkerMapper.fromDomain(person);
        input = {
            person: personEntity,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.TEACHER
        };
        const userRepository = MockRepositoriesForUnitTest.mockRepositories();
        userRepository.create = jest.fn()
            .mockImplementation(() => { throw new QueryFailedError(null, null, new Error('failed')) });
        const personRepository = MockRepositoriesForUnitTest.mockRepositories();
        // personRepository.find = jest.fn().mockReturnValueOnce(() => personEntity);
        const service = new CreateUserService(userRepository, personRepository);
        await expect(service.execute(input)).rejects.toThrow(QueryFailedError)
    });

});
