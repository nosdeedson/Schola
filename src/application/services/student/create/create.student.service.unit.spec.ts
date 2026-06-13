import { CreateStudentDto } from "./create.student.dto";
import { CreateStudentService } from './create.student.service';
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { ClassMapper } from "@/infrastructure/mappers/schoolgroup/class-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { Student } from "@/domain/student/student";


describe('CreateStudentService', () => {

    it('should throw a SystemError if schoolgroup not found', async () => {
        const dto = new CreateStudentDto(new Date(), 'edson', '123', ['marie']);
        const schoolgroupRepository = MockRepositoriesForUnitTest.mockRepositories();
        schoolgroupRepository.findByClassCode = jest.fn().mockImplementationOnce(() => { return null })
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new CreateStudentService(studentRepository, schoolgroupRepository);
        await expect(service.execute(dto)).rejects
            .toMatchObject({ errors: [{ context: 'student', message: 'Schoolgroup not found' }] });
        expect(schoolgroupRepository.findByClassCode).toHaveBeenCalledTimes(1);
        expect(schoolgroupRepository.findByClassCode).toHaveBeenCalledWith(dto.enrolled);
        expect(studentRepository.create).toHaveBeenCalledTimes(0);
    });

    it('should update a previous student registered when father registered', async () => {
        const student = mockStudent();
        const schoolgroupRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classModel = mockClass();
        schoolgroupRepository.findByClassCode = jest.fn().mockImplementationOnce(() => { return classModel });
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.findStudentByNameAndParentNames = jest.fn()
            .mockImplementation(async () => await Promise.resolve(student));
        const dto = new CreateStudentDto(new Date(), 'edson', '123', ['marie']);
        const service = new CreateStudentService(studentRepository, schoolgroupRepository);
        const result = await service.execute(dto);
        expect(result).toBeInstanceOf(Student);
        expect(studentRepository.findStudentByNameAndParentNames).toHaveBeenCalledTimes(1);
        expect(studentRepository.create).toHaveBeenCalledTimes(1);
        expect(schoolgroupRepository.findByClassCode).toHaveBeenCalledTimes(1);
    });

    it('should save student', async () => {
        const schoolGroup = mockClass();
        const schoolgroupRepository = MockRepositoriesForUnitTest.mockRepositories();
        schoolgroupRepository.findByClassCode = jest.fn().mockImplementationOnce(() => { return schoolGroup });
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.findStudentByNameAndParentNames = jest.fn().mockImplementation(() => null);

        const student = mockStudent();

        studentRepository.create = jest.fn().mockImplementation(async () => await Promise.resolve(student));

        const dto = new CreateStudentDto(new Date(), student.getName(), '123', ['marie']);
        const service = new CreateStudentService(studentRepository, schoolgroupRepository);

        const result = await service.execute(dto);
        expect(result).toBeInstanceOf(Student);
        expect(studentRepository.findStudentByNameAndParentNames).toHaveBeenCalledTimes(1);
        expect(studentRepository.create).toHaveBeenCalledTimes(1);
        expect(schoolgroupRepository.findByClassCode).toHaveBeenCalledTimes(1);
        expect(schoolgroupRepository.findByClassCode).toHaveBeenCalledWith(dto.enrolled);
    });

    it('should find a student by name and parents', async () => {
        const schoolgroupRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classModel = mockClass();
        schoolgroupRepository.findByClassCode = jest.fn().mockImplementationOnce(() => { return classModel });

        const student = mockStudent();
        student.setSchoolGroup(classModel);
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();

        studentRepository.findStudentByNameAndParentNames = jest.fn()
            .mockImplementation(async () => await Promise.resolve(student));
        const dto = new CreateStudentDto(new Date(), 'edson', '123', ['marie']);
        const service = new CreateStudentService(studentRepository, schoolgroupRepository);
        const result = await service.execute(dto) as Student;
        expect(result).toBeInstanceOf(Student);
        expect(result.getSchoolGroup()).toEqual(classModel)
        expect(studentRepository.findStudentByNameAndParentNames).toHaveBeenCalledTimes(1);
        expect(studentRepository.create).toHaveBeenCalledTimes(1);
        expect(schoolgroupRepository.findByClassCode).toHaveBeenCalledTimes(1);
    });



    it('should save student', async () => {
        const schoolGroup = mockClass();
        const schoolgroupRepository = MockRepositoriesForUnitTest.mockRepositories();
        schoolgroupRepository.findByClassCode = jest.fn().mockImplementationOnce(() => { return schoolGroup });
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.findStudentByNameAndParentNames = jest.fn().mockImplementation(() => null);

        const student = mockStudent();

        studentRepository.create = jest.fn().mockImplementation(async () => await Promise.resolve(student));

        const dto = new CreateStudentDto(new Date(), student.getName(), '123', ['marie']);
        const service = new CreateStudentService(studentRepository, schoolgroupRepository);

        const result = await service.execute(dto);
        expect(result).toBeInstanceOf(Student);
        expect(studentRepository.findStudentByNameAndParentNames).toHaveBeenCalledTimes(1);
        expect(studentRepository.create).toHaveBeenCalledTimes(1);
        expect(schoolgroupRepository.findByClassCode).toHaveBeenCalledTimes(1);
        expect(schoolgroupRepository.findByClassCode).toHaveBeenCalledWith(dto.enrolled);
    });
});
