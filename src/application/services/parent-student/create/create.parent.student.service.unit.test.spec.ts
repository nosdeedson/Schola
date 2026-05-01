import { MockRepositoriesForUnitTest } from "../../../../infrastructure/__mocks__/mockRepositories";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { CreateParentDto } from "../../parent/create/create.parent.dto";
import { CreateParentService } from "../../parent/create/create.parent.service";
import { CreateParentStudentService } from "../../parent-student/create/create.parent.student.service";
import { ParentStudentEntity } from "../../../../infrastructure/entities/parent-student/parent.student.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { CreateStudentService } from "../../student/create/create.student.service";
import { CreateStudentDto } from "../../student/create/create.student.dto";
import { PersonEntity } from "@/infrastructure/entities/@shared/person.entity";

describe('CreateParentStudentService', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should create a parent entity', async () => {
        const mockParent = DomainMocks.mockParent();
        const mockEntity = ParentEntity.toParentEntity(mockParent);

        const mockStudent = DomainMocks.mockStudent();
        const mockStudentEntity = StudentEntity.toStudentEntity(mockStudent);

        const parentStudentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();

        const parentService = jest.spyOn(CreateParentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(mockEntity));

        studentRepository.create = jest.fn().mockResolvedValue(mockStudentEntity);
        studentRepository.findStudentByNameAndParentNames = jest.fn()
            .mockImplementation(() => Promise.resolve(null));
        const parentStudent = ParentStudentEntity.toParentStudentEntity(mockEntity, mockStudentEntity);
        parentStudentRepository.create = jest.fn().mockResolvedValue(parentStudent);

        const dto = new CreateParentDto(mockParent.getBirthday(), mockParent.getName(), ['jose']);
        const service = new CreateParentStudentService({
            parentRepository,
            studentRepository,
            classRepository,
            parentStudentRepository
        });

        expect(await service.execute(dto)).toBeInstanceOf(PersonEntity);
        expect(parentStudentRepository.create).toHaveBeenCalled();
        expect(parentService).toHaveBeenCalled();
        expect(studentRepository.create).toHaveBeenCalled();
    });

    it('while creating a parent should not create a student if exists', async () => {
        const mockParent = DomainMocks.mockParent();
        const mockEntity = ParentEntity.toParentEntity(mockParent);

        const mockStudent = DomainMocks.mockStudent();
        const mockStudentEntity = StudentEntity.toStudentEntity(mockStudent);

        const parentStudentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();

        const parentService = jest.spyOn(CreateParentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(mockEntity));

        studentRepository.create = jest.fn().mockResolvedValue(mockStudentEntity);
        studentRepository.findStudentByNameAndParentNames = jest.fn()
            .mockImplementation(() => Promise.resolve(mockStudentEntity));

        const parentStudent = ParentStudentEntity.toParentStudentEntity(mockEntity, mockStudentEntity);
        parentStudentRepository.create = jest.fn().mockResolvedValue(parentStudent);

        const dto = new CreateParentDto(mockParent.getBirthday(), mockParent.getName(), ['jose']);
        const service = new CreateParentStudentService({
            parentRepository,
            studentRepository,
            classRepository,
            parentStudentRepository
        });

        expect(await service.execute(dto)).toBeInstanceOf(PersonEntity);
        expect(parentStudentRepository.create).toHaveBeenCalledTimes(0)
        expect(parentService).toHaveBeenCalled();
        expect(studentRepository.findStudentByNameAndParentNames).toHaveBeenCalledTimes(1);
        expect(studentRepository.create).toHaveBeenCalledTimes(0);
    })

    it('should create a student entity', async () => {
        const mockParent = DomainMocks.mockParent();
        const mockEntity = ParentEntity.toParentEntity(mockParent);

        const mockStudent = DomainMocks.mockStudent();
        const mockStudentEntity = StudentEntity.toStudentEntity(mockStudent);

        const parentStudentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();

        const studentService = jest.spyOn(CreateStudentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(mockStudentEntity));

        parentRepository.create = jest.fn().mockResolvedValue(mockEntity);
        parentRepository.findByParentNameAndStudentNames = jest.fn()
            .mockImplementation(() => Promise.resolve(null));
        const parentStudent = ParentStudentEntity.toParentStudentEntity(mockEntity, mockStudentEntity);
        parentStudentRepository.create = jest.fn().mockResolvedValue(parentStudent);

        const dto = new CreateStudentDto(mockStudent.getBirthday(), mockStudent.getName(), '123', ['marie']);
        const service = new CreateParentStudentService({
            parentRepository: parentRepository,
            studentRepository: studentRepository,
            parentStudentRepository: parentStudentRepository,
            classRepository: classRepository,
        });

        expect(await service.execute(dto)).toBeInstanceOf(PersonEntity);
        expect(parentStudentRepository.create).toHaveBeenCalled();
        expect(studentService).toHaveBeenCalled();
        expect(parentRepository.create).toHaveBeenCalled();
    });

    it('while creating a student should not create a parent if exists already', async () => {
        const mockParent = DomainMocks.mockParent();
        const mockEntity = ParentEntity.toParentEntity(mockParent);

        const mockStudent = DomainMocks.mockStudent();
        const mockStudentEntity = StudentEntity.toStudentEntity(mockStudent);

        const parentStudentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();

        const studentService = jest.spyOn(CreateStudentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(mockStudentEntity));

        parentRepository.create = jest.fn().mockResolvedValue(mockEntity);
        parentRepository.findByParentNameAndStudentNames = jest.fn()
            .mockImplementation(() => Promise.resolve(mockEntity));
        
        const parentStudent = ParentStudentEntity.toParentStudentEntity(mockEntity, mockStudentEntity);
        parentStudentRepository.create = jest.fn().mockResolvedValue(parentStudent);

        const dto = new CreateStudentDto(mockStudent.getBirthday(), mockStudent.getName(), '123', ['marie']);
        const service = new CreateParentStudentService({
            parentRepository: parentRepository,
            studentRepository: studentRepository,
            parentStudentRepository: parentStudentRepository,
            classRepository: classRepository,
        });

        expect(await service.execute(dto)).toBeInstanceOf(PersonEntity);
        expect(parentStudentRepository.create).toHaveBeenCalledTimes(0);
        expect(studentService).toHaveBeenCalledTimes(1);
        expect(parentRepository.findByParentNameAndStudentNames).toHaveBeenCalledTimes(1)
        expect(parentRepository.create).toHaveBeenCalledTimes(0);
    });
});