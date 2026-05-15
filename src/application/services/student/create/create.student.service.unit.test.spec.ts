import { CreateStudentDto } from "./create.student.dto";
import { CreateStudentService } from '../create/create.student.service';
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";


describe('CreateStudentService', () =>{

    it('should throw a SystemError if schoolgroup not found', async () =>{
        const dto = new CreateStudentDto(new Date(), 'edson', '123', ['marie']);
        const schoolgroupRepository = MockRepositoriesForUnitTest.mockRepositories();
        schoolgroupRepository.findByClassCode = jest.fn().mockImplementationOnce(() => {return null})
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new CreateStudentService(studentRepository, schoolgroupRepository);
        await expect( service.execute(dto)).rejects
            .toMatchObject({errors: [{context: 'student', message: 'Schoolgroup not found'}]});
        expect(schoolgroupRepository.findByClassCode).toHaveBeenCalledTimes(1);
        expect(schoolgroupRepository.findByClassCode).toHaveBeenCalledWith(dto.enrolled);
        expect(studentRepository.create).toHaveBeenCalledTimes(0);
    });

    it('should update a previous student registered when father registered', async () => {
        const student = mockStudent();
        const studentEntity = StudentEntity.toStudentEntity(student);
        const schoolgroupRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classModel = mockClass();
        const classEntity = ClassEntity.toClassEntity(classModel);
        schoolgroupRepository.findByClassCode = jest.fn().mockImplementationOnce(() => {return classEntity});
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.findStudentByNameAndParentNames = jest.fn()
            .mockImplementation(async () => await Promise.resolve(studentEntity));
        const dto = new CreateStudentDto(new Date(), 'edson', '123', ['marie']);
        const service = new CreateStudentService(studentRepository, schoolgroupRepository);
        const result = await service.execute(dto);
        expect(result).toBeInstanceOf(StudentEntity);
        expect(studentRepository.findStudentByNameAndParentNames).toHaveBeenCalledTimes(1);
        expect(studentRepository.create).toHaveBeenCalledTimes(1);
        expect(schoolgroupRepository.findByClassCode).toHaveBeenCalledTimes(1);
    });

    it('should save student', async () =>{
        const schoolGroup = mockClass();
        const schoolGroupEntity = ClassEntity.toClassEntity(schoolGroup);
        const schoolgroupRepository = MockRepositoriesForUnitTest.mockRepositories();
        schoolgroupRepository.findByClassCode = jest.fn().mockImplementationOnce(() => {return schoolGroupEntity});
        const studentRepository = MockRepositoriesForUnitTest.mockRepositories();
        studentRepository.findStudentByNameAndParentNames = jest.fn().mockImplementation(() => null);
        
        const student = mockStudent();
        const studentEntity = StudentEntity.toStudentEntity(student);

        studentRepository.create = jest.fn().mockImplementation(async () => await Promise.resolve(studentEntity));
        
        const dto = new CreateStudentDto(new Date(), student.getName(), '123', ['marie']);
        const service = new CreateStudentService(studentRepository, schoolgroupRepository);

        const result  = await service.execute(dto);
        expect(result).toBeInstanceOf(StudentEntity);
        expect(studentRepository.findStudentByNameAndParentNames).toHaveBeenCalledTimes(1);
        expect(studentRepository.create).toHaveBeenCalledTimes(1);        
        expect(schoolgroupRepository.findByClassCode).toHaveBeenCalledTimes(1);
        expect(schoolgroupRepository.findByClassCode).toHaveBeenCalledWith(dto.enrolled);
    });
});