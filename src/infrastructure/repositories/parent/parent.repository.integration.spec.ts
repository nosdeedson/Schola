import { ParentEntity } from "../../entities/parent/parent.entity";
import { ParentRepository } from './parent.repository';
import { StudentRepository } from '../student/student.repository';
import { StudentEntity } from "../../entities/student/student.entity";
import { ParentStudentEntity } from "../../entities/parent-student/parent.student.entity";
import { ParentStudentRepository } from "../parent-student/parent.student.repositoy";
import { TestDataSource } from "../config-test/test.datasource";
import { mockParent } from "../../../../tests/mocks/domain/parent.mocks";
import { mockStudent } from "../../../../tests/mocks/domain/student.mocks";
import { QueryFailedError } from "typeorm";


describe('ParentRepository unit test', () => {

    let parentModel;
    let parentRepository: ParentRepository;
    let studentModel;
    let studentRepository: StudentRepository;

    let parentStudentModel;
    let parentStudentRepository: ParentStudentRepository;

    beforeEach(async () => {
        parentModel = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(TestDataSource);
        studentModel = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(TestDataSource);
        parentStudentModel = TestDataSource.getRepository(ParentStudentEntity);
        parentStudentRepository = new ParentStudentRepository(TestDataSource);
    });

    it('repository should be instantiate', () => {
        expect(parentRepository).toBeDefined();
    });

    it('should save a parent model to the BD', async () => {
        let parent = mockParent();
        let model = ParentMapper.fromDomain(parent);
        let wantedId = parent.getId();

        expect(await parentRepository.create(model)).toBeInstanceOf(ParentEntity);

        let result = await parentRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId);
    });

    it('should delete a parent model to the BD', async () => {
        let parent = mockParent();
        let model = ParentMapper.fromDomain(parent);
        let wantedId = parent.getId();
        await parentRepository.create(model);

        let result = await parentRepository.find(wantedId);
        expect(result).toBeDefined();

        expect(await parentRepository.delete(wantedId)).toBe(void 0);
        result = await parentRepository.find(wantedId);
        expect(result).toBeNull();
    });

    it('should not throw an error while finding a parent with no-existent id', async () => {
        let parent = mockParent();
        let model = ParentMapper.fromDomain(parent);

        let wantedId = '6a0e9000-c5f9-4dad-bd4a-e4642964c2fb';
        await parentRepository.create(model);
        let result = await parentRepository.find(parent.getId());
        expect(result).toBeDefined();
        expect(await parentRepository.delete(wantedId)).toBe(void 0);
        result = await parentRepository.find(parent.getId());
        expect(result).toBeDefined();

    });

    it('should find a parent model to the BD', async () => {
        let parent = mockParent();
        let model = ParentMapper.fromDomain(parent);
        let wantedId = parent.getId();
        await parentRepository.create(model);

        let result = await parentRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId);
    });

    it('should find a parent by name and by student names', async () => {
        let parent = mockParent();
        const wantedParentName = parent.getName();
        let parentEntity = ParentMapper.fromDomain(parent);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(ParentEntity);

        let student = mockStudent();
        const wantedStudetName = student.getName();
        let studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        let parenteStudent = ParentStudentMapper.fromDomain(parentEntity, studentEntity);
        expect(await parentStudentRepository.create(parenteStudent)).toBeInstanceOf(ParentStudentEntity);

        let result = await parentRepository.findByParentNameAndStudentNames(wantedParentName, [wantedStudetName]);
        expect(result).toBeDefined();
        expect(result.fullName).toBe(parent.getName());
    });

    it('should find all parent', async () => {
        let parent = mockParent();
        let parent1 = mockParent();
        let parentEntity = ParentMapper.fromDomain(parent);
        let parentEntity1 = ParentMapper.fromDomain(parent1);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(ParentEntity);
        expect(await parentRepository.create(parentEntity1)).toBeInstanceOf(ParentEntity);

        let results = await parentRepository.findAll();

        expect(results.length).toBe(2);
        expect(results[0].id).toBe(parentEntity.id);
        expect(results[1].id).toBe(parentEntity1.id);
    });

    it('should update a parent model to the BD', async () => {
        let parent = mockParent();
        parent.setBirthDay(null as any);
        let model = ParentMapper.fromDomain(parent);
        expect(await parentRepository.create(model)).toBeInstanceOf(ParentEntity);
        let expectedBirthDay = new Date('2022-12-12');
        model.birthday = expectedBirthDay;
        expect(await parentRepository.update(model)).toBe(void 0);
        let result = await parentRepository.find(parent.getId());
        expect(result).toBeDefined();
        expect(result.birthday.toLocaleDateString()).toBe(expectedBirthDay.toLocaleDateString());
    });

    it('should throw a QueryFailedError error', async () => {
        const entity = new ParentEntity();
        await expect(parentRepository.create(entity)).rejects.toThrow(QueryFailedError);
    });
});
