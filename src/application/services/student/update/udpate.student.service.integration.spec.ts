import { Repository } from "typeorm";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { UpdateStudentDto } from '../update/udpate.student.dto';
import { UpdateStudentService } from '../update/udpate.student.service';
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { Student } from "@/domain/student/student";

describe('UpdateStudentService integration tests', () => {
    let studentRepository: StudentRepository;

    beforeAll(async () => {
        studentRepository = new StudentRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('repositories must be instantiated', () => {
        expect(studentRepository).toBeDefined();
    });

    it('should throw a SystemError if student not found', async () => {
        const wantedId = 'fe62e23d-1685-4e68-b9f9-480f46772e01';
        const dto = new UpdateStudentDto(wantedId, '1234');
        const service = new UpdateStudentService(studentRepository);

        await expect(service.execute(dto)).rejects
            .toMatchObject({ errors: [{ context: 'student', message: 'student not found' }] });
    });

    it('should update a student in database', async () => {
        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);
        let updatedErroled = '987';
        const service = new UpdateStudentService(studentRepository);
        const dto = new UpdateStudentDto(student.getId(), updatedErroled);
        expect(await service.execute(dto)).toBe(void 0);
        const updatedStudent = await studentRepository.find(student.getId());
        expect(updatedStudent.getEnrolled()).toBe(updatedErroled)
    });
});
