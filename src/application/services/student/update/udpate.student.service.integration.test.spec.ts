import { Repository } from "typeorm";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { UpdateStudentDto } from '../update/udpate.student.dto';
import { UpdateStudentService } from '../update/udpate.student.service';
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";

describe('UpdateStudentService integration tests', () => {
    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    beforeAll(async () => {
        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('repositories must be instantiated', () => {
        expect(studentRepository).toBeDefined();
        expect(studentEntity).toBeDefined();
    });

    it('should throw a SystemError if student not found', async () => {
        const wantedId = 'fe62e23d-1685-4e68-b9f9-480f46772e01';
        const dto = new UpdateStudentDto(wantedId, '1234');
        const service = new UpdateStudentService(studentRepository);

        try {
            await service.execute(dto);
        } catch (error) {
            expect(error).toBeDefined();
            //@ts-ignore
            expect(error.errors).toMatchObject([{ context: 'student', message: 'student not found' }]);
        }

    });

    it('should update a student in database', async () => {
        let student = mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);
        let updatedErroled = '987';
        const service = new UpdateStudentService(studentRepository);
        const dto = new UpdateStudentDto(student.getId(), updatedErroled);
        expect(await service.execute(dto)).toBe(void 0);
        const updatedStudent = await studentRepository.find(student.getId());
        expect(updatedStudent.enrolled).toBe(updatedErroled)
    });
});
