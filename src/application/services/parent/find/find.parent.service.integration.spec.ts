import { Repository } from "typeorm";
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { FindParentService } from './find.parent.service';
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockParent } from "../../../../../tests/mocks/domain/parent.mocks";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { ParentMapper } from "@/infrastructure/mappers/parent/parent-mapper";
import { Parent } from "@/domain/parent/parent";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { Student } from "@/domain/student/student";

describe('FindParentService integration tests ', () => {
    let parentEntity: Repository<ParentEntity>;
    let parentRepository: ParentRepository;

    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;

    beforeEach(async () => {
        parentEntity = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(TestDataSource);

        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('entitites and repositories must be instantiated', async () => {
        expect(parentEntity).toBeDefined();
        expect(parentRepository).toBeDefined();
        expect(studentEntity).toBeDefined();
        expect(studentRepository).toBeDefined();
    })

    it('should not find a parent passing a non-existent id', async () => {
        let parent = mockParent();
        let parentEntity = ParentMapper.fromDomain(parent);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(Parent);
        const wantedId = 'e9c826b0-2fb4-41a7-aae8-8eed8fa999e8';
        const service = new FindParentService(parentRepository);
        await expect(service.execute(wantedId)).rejects
            .toMatchObject({ errors: [{ context: 'parent', message: 'Parent not found' }] })
    });

    it('should find a parent', async () => {
        let parent = mockParent();
        let students = [mockStudent()];
        parent.setStudents(students);
        students[0].setParents(parent);

        let studentEntity = StudentMapper.fromDomain(students[0]);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        let parentEntity = ParentMapper.fromDomain(parent);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(Parent);

        const wantedId = parent.getId();

        const service = new FindParentService(parentRepository);
        let result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toBe(wantedId);
        expect(result.name).toBe(parent.getName());
    });

});
