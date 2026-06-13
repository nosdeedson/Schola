import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { FindStudentService } from '../find/find.student.service';
import { Repository } from "typeorm";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { Student } from "@/domain/student/student";


describe('FindStudentService integration tests', () => {
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

    it('should throw a SystemError if student does not exisit', async () => {
        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let noExixtentId = 'ddb5186b-9a8d-4c5d-8086-2cccc0499c11';
        const service = new FindStudentService(studentRepository);
        await expect(service.execute(noExixtentId)).rejects.toMatchObject({
            errors:
                [{ context: 'student', message: 'student not found' }]
        });
    })

    it('should find a student', async () => {
        let student = mockStudent();
        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let wantedId = student.getId();
        const service = new FindStudentService(studentRepository);
        let result = await service.execute(wantedId)
        expect(result).toBeDefined();
        expect(result.getId()).toBe(wantedId);
        expect(result.getName()).toBe(student.getName());
        expect(result.getEnrolled()).toBe(student.getEnrolled());
    });
});
