import { AccessType } from "../../../../domain/user/access.type";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { MockRepositoriesForUnitTest } from "../../../../infrastructure/__mocks__/mockRepositories";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { CreateUserService } from './create.user.service';
import { InputCreateUserDto } from "./input.create.user.dto";


describe('create user service unit test', () =>{

    let input: InputCreateUserDto;

    afterEach(() =>{
        jest.clearAllMocks()
    })

    it('should create an user of type teacher', async () =>{
        const person = DomainMocks.mockWorker(RoleEnum.TEACHER);
        const personEntity = WorkerEntity.toWorkerEntity(person);
        input = {
            person: personEntity,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.TEACHER
        };
        const createUserservice = jest.spyOn(CreateUserService.prototype, 'typePerson')
            .mockImplementationOnce(() => { return person});
        const userRepository = MockRepositoriesForUnitTest.mockRepositories();
        const personRepository = MockRepositoriesForUnitTest.mockRepositories();
        personRepository.find = jest.fn().mockReturnValueOnce(() => personEntity);
        const service = new CreateUserService(userRepository, personRepository);
        expect(await service.execute(input)).toBe(void 0);
        expect(createUserservice).toHaveBeenCalled()
    });

    it('should create an user of type admin', async () =>{
        const person = DomainMocks.mockWorker(RoleEnum.ADMINISTRATOR);
        const personEntity = WorkerEntity.toWorkerEntity(person);
        input = {
            person: personEntity,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.ADMIN
        };
        const typePerson = jest.spyOn(CreateUserService.prototype, 'typePerson')
            .mockImplementationOnce(() => { return person});
        const userRepository = MockRepositoriesForUnitTest.mockRepositories();
        const personRepository = MockRepositoriesForUnitTest.mockRepositories();
        personRepository.find = jest.fn().mockReturnValueOnce(() => personEntity);
        const service = new CreateUserService(userRepository, personRepository);
        expect(await service.execute(input)).toBe(void 0);
        expect(typePerson).toHaveBeenCalled();
    });

    it('should create an user of type student', async () =>{
        const person = DomainMocks.mockStudent();
        const personEntity = StudentEntity.toStudentEntity(person);
        input = {
            person: personEntity,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.STUDENT
        };


        const typePerson = jest.spyOn(CreateUserService.prototype, 'typePerson')
            .mockImplementationOnce(() => { return person});

        const userRepository = MockRepositoriesForUnitTest.mockRepositories();
        const personRepository = MockRepositoriesForUnitTest.mockRepositories();

        personRepository.find = jest.fn().mockReturnValueOnce(() => personEntity);

        const service = new CreateUserService(userRepository, personRepository);

        expect(await service.execute(input)).toBe(void 0);
        expect(typePerson).toHaveBeenCalled();
    });

    it('should create an user of type parent', async () =>{
        const person = DomainMocks.mockParent();
        const personEntity = ParentEntity.toParentEntity(person);
        input = {
            person: personEntity,
            email: 'teste@teste',
            password: '1234',
            nickname: 'teste',
            accesstype: AccessType.PARENT
        };
        const typePerson = jest.spyOn(CreateUserService.prototype, 'typePerson')
            .mockImplementationOnce(() => { return person});

        const userRepository = MockRepositoriesForUnitTest.mockRepositories();
        const personRepository = MockRepositoriesForUnitTest.mockRepositories();

        personRepository.find = jest.fn().mockReturnValueOnce(() => personEntity);

        const service = new CreateUserService(userRepository, personRepository);
        
        expect(await service.execute(input)).toBe(void 0);
        expect(typePerson).toHaveBeenCalled();
    });
    
});