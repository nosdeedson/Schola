import { DomainMocks } from "../../__mocks__/mocks";
import { ClassEntity } from "../../entities/class/class.entity";
import { StudentEntity } from "../../entities/student/student.entity";
import { ParentStudentEntity } from "../../entities/parent-student/parent.student.entity";
import { StudentRepository } from '../../repositories/student/student.repository';
import { ParentRepository } from '../../repositories/parent/parent.repository';
import { ParentStudentRepository } from '../../repositories/parent-student/parent.student.repositoy';
import { ClassRepository } from '../../repositories/class/class.repository';
import { Class } from "../../../domain/class/class";
import { Student } from "../../../domain/student/student";
import { ParentEntity } from "../../entities/parent/parent.entity";
import { TestDataSource } from "../config-test/test.datasource";
import { mockStudent } from "../../../../tests/mocks/domain/student.mocks";

const MILISECONDS = 1000;

describe('StudentRepository unit test', () => {

    let studentModel;
    let studentRepository: StudentRepository;
    let schoolGroupModel;
    let schoolGroupRepository: ClassRepository;
    let parentModel;
    let parentRepository: ParentRepository;
    let parentStudentModel;
    let parentStudentRepository: ParentStudentRepository;

    beforeAll(() => {
        studentModel = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentModel, TestDataSource);
        schoolGroupModel = TestDataSource.getRepository(ClassEntity);
        schoolGroupRepository = new ClassRepository(TestDataSource);
        parentModel = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(parentModel, TestDataSource);
        parentStudentModel = TestDataSource.getRepository(ParentStudentEntity);
        parentStudentRepository = new ParentStudentRepository(parentStudentModel);
    });

    beforeEach(async () => {
        jest.clearAllMocks();
    })

    it('studentRepository should instantiated', () => {
        expect(studentRepository).toBeDefined();
        expect(schoolGroupRepository).toBeDefined();
        expect(parentRepository).toBeDefined();
        expect(parentStudentRepository).toBeDefined();
    });

    it('should save a student in BD', async () => {
        let student = DomainMocks.mockStudentWithoutParent();
        let model = StudentEntity.toStudentEntity(student);
        let wantedId = student.getId();
        expect(await studentRepository.create(model)).toBeInstanceOf(StudentEntity);

        let result = await studentRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId);
    });

    it('should delete a student in BD', async () => {
        let student = DomainMocks.mockStudent();
        let model = StudentEntity.toStudentEntity(student);
        let wantedId = student.getId();
        expect(await studentRepository.create(model)).toBeInstanceOf(StudentEntity);

        let result = await studentRepository.find(wantedId);
        expect(result).toBeDefined();

        expect(await studentRepository.delete(wantedId)).toBe(void 0);
        result = await studentRepository.find(wantedId);

        expect(result).toBeNull();
    });

    it('should find a student in BD', async () => {
        let student = DomainMocks.mockStudent();
        let model = StudentEntity.toStudentEntity(student);
        let wantedId = student.getId();
        expect(await studentRepository.create(model)).toBeInstanceOf(StudentEntity);

        let result = await studentRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toBe(wantedId);
    });

    it('should find all students by ids in BD', async () => {
        let student1 = DomainMocks.mockStudent();
        let model1 = StudentEntity.toStudentEntity(student1);
        expect(await studentRepository.create(model1)).toBeInstanceOf(StudentEntity);

        let student2 = new Student({
            birthday: new Date,
            name: 'edson',
            enrolled: '123',
            nameParents: student1.getParents().map(it => it.getName()),
            id: '90be2abb-f2da-46c0-9fc8-520c988b34f9'
        });
        let model2 = StudentEntity.toStudentEntity(student2);
        expect(await studentRepository.create(model2)).toBeInstanceOf(StudentEntity);

        let students = await studentRepository.findAll();
        expect(students).toHaveLength(2);
        expect(students[0].fullName).toEqual(model1.fullName);
        expect(students[1].fullName).toEqual(model2.fullName);
    });

    it('should update a student in BD', async () => {
        // schoogroup to student
        let schoolGroup = DomainMocks.mockSchoolGroup();
        let schoolGroupModel = ClassEntity.toClassEntity(schoolGroup);
        await schoolGroupRepository.create(schoolGroupModel);

        // create student
        let student = DomainMocks.mockStudent();
        student.setSchoolGroup(schoolGroup);
        let wantedId = student.getId();
        let model = StudentEntity.toStudentEntity(student);

        expect(await studentRepository.create(model)).toBeInstanceOf(StudentEntity);

        let result = await studentRepository.find(wantedId);
        expect(result).toBeDefined();

        let schedule = DomainMocks.mockSchedule();
        let schoolGroup1 = new Class('4321', 'b1', 'b1', schedule, '6f76562a-b91f-43e7-89fd-60151436371c')
        let wantedSchoolGroupId = '6f76562a-b91f-43e7-89fd-60151436371c';
        let schoolGroupModel1 = ClassEntity.toClassEntity(schoolGroup1);
        await schoolGroupRepository.create(schoolGroupModel1);

        let newSchoolGroup = await schoolGroupRepository.find(wantedSchoolGroupId);
        result.schoolGroup = newSchoolGroup;
        expect(await studentRepository.update(result)).toBe(void 0);

        result = await studentRepository.find(result.id);
        expect(result).toBeDefined();
        expect(result.schoolGroup.classCode).toEqual(schoolGroup1.getClassCode());
    });

    it('should find a student by name and parents name', async () => {
        const student = DomainMocks.mockStudentWithoutParent();
        const wantedStudentName = student.getName();
        const studentEntity = StudentEntity.toStudentEntity(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(StudentEntity);

        const parent = DomainMocks.mockParentWithoutStudent();
        const wantedParentName = parent.getName();
        const parentEntity = ParentEntity.toParentEntity(parent);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(ParentEntity);
        const parentStudentEntity = ParentStudentEntity.toParentStudentEntity(parentEntity, studentEntity);
        expect(await parentStudentRepository.create(parentStudentEntity)).toBeInstanceOf(ParentStudentEntity);

        const result = await studentRepository.findStudentByNameAndParentNames(wantedStudentName, [wantedParentName]);
        expect(result).toBeDefined();
        expect(result.fullName).toEqual(wantedStudentName);
    });

    it('should update all students', async () => {
        const student1 = mockStudent();
        const student2 = mockStudent({ name: "test 2" });
        const entity1 = StudentEntity.toStudentEntity(student1);
        const entity2 = StudentEntity.toStudentEntity(student2);
        expect(await studentRepository.updateAll([entity1, entity2])).toBe(void 0);
        const students = await studentRepository.findAll();
        expect(students).toHaveLength(2);
    });

    it('findByIds test', async () => {
        const student1 = mockStudent();
        const entity1 = StudentEntity.toStudentEntity(student1);
        const wantedIds = [entity1.id];
        expect(await studentRepository.create(entity1)).toBeInstanceOf(StudentEntity);
        const result = await studentRepository.findByIds(wantedIds);
        expect(result).toHaveLength(1);
        expect(wantedIds.includes(result[0].id)).toBeTruthy()
    }, 20000);
});
