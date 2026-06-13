import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { CreateParentDto } from "../../parent/create/create.parent.dto";
import { CreateParentService } from "../../parent/create/create.parent.service";
import { CreateParentStudentService } from "./create.parent.student.service";
import { CreateStudentService } from "../../student/create/create.student.service";
import { CreateStudentDto } from "../../student/create/create.student.dto";
import { PersonEntity } from "@/infrastructure/entities/@shared/person.entity";
import { mockParent } from "../../../../../tests/mocks/domain/parent.mocks";
import { mockStudent, } from "../../../../../tests/mocks/domain/student.mocks";
import { QueryFailedError } from "typeorm";
import { ParentMapper } from "@/infrastructure/mappers/parent/parent-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { ParentStudentMapper } from "@/infrastructure/mappers/parent-student/parent-student-mapper";
import { Person } from "@/domain/@shared/person";
import { Student } from "@/domain/student/student";

describe('CreateParentStudentService', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should create a parent entity', async () => {
        const parentStudentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();

        const parentMock = mockParent();
        const studentMock = mockStudent();
        const parentService = jest.spyOn(CreateParentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(parentMock));

        studentRepository.create = jest.fn().mockResolvedValue(studentMock);
        studentRepository.findStudentByNameAndParentNames = jest.fn()
            .mockImplementation(() => Promise.resolve(null));
        const parentStudent = ParentStudentMapper.fromDomain(parentMock, studentMock);
        parentStudentRepository.create = jest.fn().mockResolvedValue(parentStudent);

        const dto = new CreateParentDto(parentMock.getBirthday(), parentMock.getName(), ['jose']);
        const service = new CreateParentStudentService({
            parentRepository,
            studentRepository,
            classRepository,
            parentStudentRepository
        });

        expect(await service.execute(dto)).toBeInstanceOf(Person);
        expect(parentStudentRepository.create).toHaveBeenCalled();
        expect(parentService).toHaveBeenCalled();
        expect(studentRepository.create).toHaveBeenCalled();
    });

    it('while creating a parent should not create a student if exists', async () => {
        const parentMock = mockParent();

        const studenMock = mockStudent();

        const parentStudentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();

        const parentService = jest.spyOn(CreateParentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(parentMock));

        studentRepository.create = jest.fn().mockResolvedValue(studenMock);
        studentRepository.findStudentByNameAndParentNames = jest.fn()
            .mockImplementation(() => Promise.resolve(studenMock));

        const parentStudent = ParentStudentMapper.fromDomain(parentMock, studenMock);
        parentStudentRepository.create = jest.fn().mockResolvedValue(parentStudent);

        const dto = new CreateParentDto(parentMock.getBirthday(), parentMock.getName(), ['jose']);
        const service = new CreateParentStudentService({
            parentRepository,
            studentRepository,
            classRepository,
            parentStudentRepository
        });

        expect(await service.execute(dto)).toBeInstanceOf(Person);
        expect(parentStudentRepository.create).toHaveBeenCalledTimes(0)
        expect(parentService).toHaveBeenCalled();
        expect(studentRepository.findStudentByNameAndParentNames).toHaveBeenCalledTimes(1);
        expect(studentRepository.create).toHaveBeenCalledTimes(0);
    })

    it('should create a student entity', async () => {
        const parentMock = mockParent();

        const studentMock = mockStudent();

        const parentStudentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();

        const studentService = jest.spyOn(CreateStudentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(studentMock));

        parentRepository.create = jest.fn().mockResolvedValue(parentMock);
        parentRepository.findByParentNameAndStudentNames = jest.fn()
            .mockImplementation(() => Promise.resolve(null));
        const parentStudent = ParentStudentMapper.fromDomain(parentMock, studentMock);
        parentStudentRepository.create = jest.fn().mockResolvedValue(parentStudent);

        const dto = new CreateStudentDto(studentMock.getBirthday(), studentMock.getName(), '123', ['marie']);
        const service = new CreateParentStudentService({
            parentRepository: parentRepository,
            studentRepository: studentRepository,
            parentStudentRepository: parentStudentRepository,
            classRepository: classRepository,
        });

        expect(await service.execute(dto)).toBeInstanceOf(Student);
        expect(parentStudentRepository.create).toHaveBeenCalled();
        expect(studentService).toHaveBeenCalled();
        expect(parentRepository.create).toHaveBeenCalled();
    });

    it('while creating a student should not create a parent if exists already', async () => {
        const parentMock = mockParent();
        const studentMock = mockStudent();

        const parentStudentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();

        const studentService = jest.spyOn(CreateStudentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(studentMock));

        parentRepository.create = jest.fn().mockResolvedValue(parentMock);
        parentRepository.findByParentNameAndStudentNames = jest.fn()
            .mockImplementation(() => Promise.resolve(parentMock));

        const parentStudent = ParentStudentMapper.fromDomain(parentMock, studentMock);
        parentStudentRepository.create = jest.fn().mockResolvedValue(parentStudent);

        const dto = new CreateStudentDto(studentMock.getBirthday(), studentMock.getName(), '123', ['marie']);
        const service = new CreateParentStudentService({
            parentRepository: parentRepository,
            studentRepository: studentRepository,
            parentStudentRepository: parentStudentRepository,
            classRepository: classRepository,
        });

        expect(await service.execute(dto)).toBeInstanceOf(Student);
        expect(parentStudentRepository.create).toHaveBeenCalledTimes(0);
        expect(studentService).toHaveBeenCalledTimes(1);
        expect(parentRepository.findByParentNameAndStudentNames).toHaveBeenCalledTimes(1)
        expect(parentRepository.create).toHaveBeenCalledTimes(0);
    });

    it('while creating a student should throw an error', async () => {
        const parentMock = mockParent();
        const mockEntity = ParentMapper.fromDomain(parentMock);

        const studentMock = mockStudent();
        const parentStudentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();

        const studentService = jest.spyOn(CreateStudentService.prototype, 'execute')
            .mockImplementation(() => { throw new QueryFailedError(null, null, new Error('failed')) });

        parentRepository.create = jest.fn().mockResolvedValue(mockEntity);
        parentRepository.findByParentNameAndStudentNames = jest.fn()
            .mockImplementation(() => Promise.resolve(mockEntity));

        const parentStudent = ParentStudentMapper.fromDomain(parentMock, studentMock);
        parentStudentRepository.create = jest.fn().mockResolvedValue(parentStudent);

        const dto = new CreateStudentDto(studentMock.getBirthday(), studentMock.getName(), '123', ['marie']);
        const service = new CreateParentStudentService({
            parentRepository: parentRepository,
            studentRepository: studentRepository,
            parentStudentRepository: parentStudentRepository,
            classRepository: classRepository,
        });

        await expect(service.execute(dto)).rejects.toThrow(QueryFailedError);
    });
});
