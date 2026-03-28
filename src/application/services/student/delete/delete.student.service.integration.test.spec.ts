import { Repository } from "typeorm";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { DeleteStudentService } from "../delete/delete.student.service";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { mockStudent } from '../../../../../tests/mocks/domain/student.mocks';

describe('DeleteStudentService integration tests', () => {
    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;
    let parentEntity: Repository<ParentEntity>;
    let parentRepository: ParentRepository;

    beforeAll(() => {
        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentEntity, TestDataSource);
        parentEntity = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(parentEntity, TestDataSource);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('repositories must be instantiated', () => {
        expect(studentRepository).toBeDefined();
        expect(studentEntity).toBeDefined();
        expect(parentEntity).toBeDefined();
        expect(parentRepository).toBeDefined();
    });

    it('should not throw a SystemError if id does not exist', async () => {
        let student = mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);
        let noExixtentId = 'ddb5186b-9a8d-4c5d-8086-2cccc0499c11';
        const service = new DeleteStudentService(studentRepository);
        expect(await service.execute(noExixtentId)).toBe(void 0);
    })

    it('should delete a student', async () => {
        let student = mockStudent();
        let studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let wantedId = student.getId();
        const service = new DeleteStudentService(studentRepository);
        expect(await service.execute(wantedId)).toBe(void 0);

        const fromBD = await studentRepository.find(student.getId());
        expect(fromBD).toBeNull();
    });
});