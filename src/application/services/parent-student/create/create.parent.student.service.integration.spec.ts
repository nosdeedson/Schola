import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { ParentStudentEntity } from "../../../../infrastructure/entities/parent-student/parent.student.entity";
import { ParentStudentRepository } from "../../../../infrastructure/repositories/parent-student/parent.student.repositoy";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { QueryFailedError, Repository } from "typeorm";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { mockParent } from "../../../../../tests/mocks/domain/parent.mocks";

describe('CreateParentStudentService Integration Test', () => {

    let parentEntity: Repository<ParentEntity>;
    let parentRepository: ParentRepository;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    let parentStudentEntity: Repository<ParentStudentEntity>;
    let parentStudentRepository: ParentStudentRepository;

    beforeAll(async () => {
        parentEntity = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(TestDataSource);

        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(TestDataSource);

        parentStudentEntity = TestDataSource.getRepository(ParentStudentEntity);
        parentStudentRepository = new ParentStudentRepository(TestDataSource);

    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('all entities should be instantiated', async () => {
        expect(parentEntity).toBeDefined();
        expect(parentRepository).toBeDefined();
        expect(studentEntity).toBeDefined();
        expect(studentRepository).toBeDefined();
        expect(parentStudentEntity).toBeDefined();
        expect(parentStudentRepository).toBeDefined();
    });

    it('should save a parentStudentEntity', async () => {
        const student = mockStudent();
        const studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        const parent = mockParent();
        const parentEntity = ParentMapper.fromDomain(parent);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(ParentEntity);

        const parentStudent = ParentStudentMapper.fromDomain(parentEntity, studentEntity);

        expect(await parentStudentRepository.create(parentStudent)).toBeInstanceOf(ParentStudentEntity);

        const results = await parentStudentRepository.findAll();
        expect(results).toHaveLength(1);
        expect(results[0]).toBeInstanceOf(ParentStudentEntity);
        expect(results[0].studentId).toBe(studentEntity.id);
        expect(results[0].parentId).toBe(parentEntity.id);
    });

    it('should save a parentStudentEntity', async () => {

        const parent = mockParent();
        const parentEntity = ParentMapper.fromDomain(parent);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(ParentEntity);

        const parentStudent = ParentStudentMapper.fromDomain(parentEntity, null);

        await expect(parentStudentRepository.create(parentStudent))
            .rejects.toThrow(QueryFailedError);
    });

});
