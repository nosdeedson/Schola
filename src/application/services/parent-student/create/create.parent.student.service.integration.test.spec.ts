import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { ParentStudentEntity } from "../../../../infrastructure/entities/parent-student/parent.student.entity";
import { ParentStudentRepository } from "../../../../infrastructure/repositories/parent-student/parent.student.repositoy";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { Repository } from "typeorm";

describe('CreateParentStudentService Integration Test', () => {
    
    let parentEntity: Repository<ParentEntity>;
    let parentRepository: ParentRepository;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;
    
    let parentStudentEntity: Repository<ParentStudentEntity>;
    let parentStudentRepository: ParentStudentRepository;

    beforeAll(async () =>{
        parentEntity = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(parentEntity, TestDataSource);

        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentEntity, TestDataSource);

        parentStudentEntity = TestDataSource.getRepository(ParentStudentEntity);
        parentStudentRepository = new ParentStudentRepository(parentStudentEntity);

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
        const student = DomainMocks.mockStudent();
        const studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        const parent = DomainMocks.mockParent();
        const parentEntity = ParentEntity.toParentEntity(parent);   
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(ParentEntity);

        const parentStudent = ParentStudentEntity.toParentStudentEntity(parentEntity, studentEntity);

        expect(await parentStudentRepository.create(parentStudent)).toBeInstanceOf(ParentStudentEntity);

        const results = await parentStudentRepository.findAll();
        expect(results).toHaveLength(1);
        expect(results[0]).toBeInstanceOf(ParentStudentEntity);
        expect(results[0].studentId).toBe(studentEntity.id);
        expect(results[0].parentId).toBe(parentEntity.id);
    });

});