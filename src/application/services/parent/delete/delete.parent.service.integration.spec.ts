import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { DeleteParentService } from "./delete.parent.service";
import { QueryFailedError, Repository } from "typeorm";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockParent } from "../../../../../tests/mocks/domain/parent.mocks";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";

describe('DeleteParentService integration tests', () => {

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
    });

    it('should not delete a parent with invalid id', async () => {
        let parent = mockParent()
        let parentEntity = ParentMapper.fromDomain(parent);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(ParentEntity);

        let result = await parentRepository.findAll();
        expect(result.length).toBe(1);

        let wantedId = 'e9c826b0-2fb4-41a7-aae8-8eed8fa999e8';
        const service = new DeleteParentService(parentRepository);
        expect(await service.execute(wantedId)).toBe(void 0);
        result = await parentRepository.findAll();
        expect(result.length).toBe(1);
    });

    it('should delete a parent', async () => {
        let parent = mockParent();
        let students = [mockStudent()];
        parent.setStudents(students);
        students[0].setParents(parent);

        let studentEntity = StudentMapper.fromDomain(students[0]);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let parentEntity = ParentMapper.fromDomain(parent);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(ParentEntity);

        let wantedId = parent.getId();
        const service = new DeleteParentService(parentRepository);
        expect(await service.execute(wantedId)).toBe(void 0);
        let result = await parentRepository.findAll();
        expect(result.length).toBe(0);
    });

    it('should throw an error while deleting a parent with an invalid id', async () => {
        let wantedId = 'e9c826b0';
        const service = new DeleteParentService(parentRepository);
        await expect(service.execute(wantedId)).rejects.toThrow(QueryFailedError)
    });

});
