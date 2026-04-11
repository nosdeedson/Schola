import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { FindStudentService } from '../find/find.student.service';
import { Repository } from "typeorm";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";


describe('FindStudentService integration tests', () => {
    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    beforeAll(async () => {
        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentEntity, TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('repositories must be instantiated', () => {
        expect(studentRepository).toBeDefined();
        expect(studentEntity).toBeDefined();
    });

    it('should throw a SystemError if student does not exisit', async () => {
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let noExixtentId = 'ddb5186b-9a8d-4c5d-8086-2cccc0499c11';
        const service = new FindStudentService(studentRepository);
        await expect(service.execute(noExixtentId)).rejects.toMatchObject({
            errors:
                [{ context: 'student', message: 'student not found' }]
        });
    })

    it('should find a student', async () => {
        let student = DomainMocks.mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let wantedId = student.getId();
        const service = new FindStudentService(studentRepository);
        let result = await service.execute(wantedId)
        expect(result).toBeDefined();
        expect(result.id).toBe(wantedId);
        expect(result.fullName).toBe(student.getName());
        expect(result.enrolled).toBe(student.getEnrolled());
    });
});
