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
import { mockClass } from "../../../../tests/mocks/domain/class.mocks";
import { mockSchedule } from "../../../../tests/mocks/domain/schedule.mocks";
import { mockParent } from "../../../../tests/mocks/domain/parent.mocks";
import { QueryFailedError } from "typeorm";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { ClassMapper } from "@/infrastructure/mappers/schoolgroup/class-mapper";
import { ParentMapper } from "@/infrastructure/mappers/parent/parent-mapper";
import { ParentStudentMapper } from "@/infrastructure/mappers/parent-student/parent-student-mapper";
import { Parent } from "@/domain/parent/parent";

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
        studentRepository = new StudentRepository(TestDataSource);
        schoolGroupModel = TestDataSource.getRepository(ClassEntity);
        schoolGroupRepository = new ClassRepository(TestDataSource);
        parentModel = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(TestDataSource);
        parentStudentModel = TestDataSource.getRepository(ParentStudentEntity);
        parentStudentRepository = new ParentStudentRepository(TestDataSource);
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
        let student = mockStudent();
        let model = StudentMapper.fromDomain(student);
        let wantedId = student.getId();
        expect(await studentRepository.create(model)).toBeInstanceOf(Student);

        let result = await studentRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.getId()).toEqual(wantedId);
    });

    it('should delete a student in BD', async () => {
        let student = mockStudent();
        let model = StudentMapper.fromDomain(student);
        let wantedId = student.getId();
        expect(await studentRepository.create(model)).toBeInstanceOf(Student);

        let result = await studentRepository.find(wantedId);
        expect(result).toBeDefined();

        expect(await studentRepository.delete(wantedId)).toBe(void 0);
        result = await studentRepository.find(wantedId);

        expect(result).toBeNull();
    });

    it('should find a student in BD', async () => {
        let student = mockStudent();
        let model = StudentMapper.fromDomain(student);
        let wantedId = student.getId();
        expect(await studentRepository.create(model)).toBeInstanceOf(Student);

        let result = await studentRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.getId()).toBe(wantedId);
    });

    it('should find all students by ids in BD', async () => {
        let student1 = mockStudent();
        let model1 = StudentMapper.fromDomain(student1);
        expect(await studentRepository.create(model1)).toBeInstanceOf(Student);

        let student2 = new Student({
            birthday: new Date,
            name: 'edson',
            enrolled: '123',
            id: '90be2abb-f2da-46c0-9fc8-520c988b34f9'
        });
        let model2 = StudentMapper.fromDomain(student2);
        expect(await studentRepository.create(model2)).toBeInstanceOf(Student);

        let students = await studentRepository.findAll();
        expect(students).toHaveLength(2);
        expect([model1.fullName, model2.fullName].includes(students[0].getName())).toBeTruthy();
        expect([model1.fullName, model2.fullName].includes(students[1].getName())).toBeTruthy();
    });

    it('should update a student in BD', async () => {
        // schoogroup to student
        let schoolGroup = mockClass();
        let schoolGroupModel = ClassMapper.fromDomain(schoolGroup);
        await schoolGroupRepository.create(schoolGroupModel);

        // create student
        let student = mockStudent();
        student.setSchoolGroup(schoolGroup);
        let wantedId = student.getId();
        let model = StudentMapper.fromDomain(student);

        expect(await studentRepository.create(model)).toBeInstanceOf(Student);

        let result = await studentRepository.find(wantedId);
        expect(result).toBeDefined();

        let schedule = mockSchedule();
        let schoolGroup1 = new Class('4321', 'b1', 'b1', schedule, '6f76562a-b91f-43e7-89fd-60151436371c')
        let wantedSchoolGroupId = '6f76562a-b91f-43e7-89fd-60151436371c';
        let schoolGroupModel1 = ClassMapper.fromDomain(schoolGroup1);
        await schoolGroupRepository.create(schoolGroupModel1);

        let newSchoolGroup = await schoolGroupRepository.find(wantedSchoolGroupId);
        result.setSchoolGroup(newSchoolGroup);
        expect(await studentRepository.update(StudentMapper.fromDomain(result))).toBe(void 0);

        result = await studentRepository.find(result.getId());
        expect(result).toBeDefined();
        expect(result.getSchoolGroup().getClassCode()).toEqual(schoolGroup1.getClassCode());
    });

    it('should find a student by name and parents name', async () => {
        const student = mockStudent();
        const wantedStudentName = student.getName();
        const studentEntity = StudentMapper.fromDomain(student);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        const parent = mockParent();
        const wantedParentName = parent.getName();
        const parentEntity = ParentMapper.fromDomain(parent);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(Parent);
        const parentStudentEntity = ParentStudentMapper.fromDomain(ParentMapper.fromEntity(parentEntity), StudentMapper.fromEntity(studentEntity));
        expect(await parentStudentRepository.create(parentStudentEntity)).toBeInstanceOf(ParentStudentEntity);

        const result = await studentRepository.findStudentByNameAndParentNames(wantedStudentName, [wantedParentName]);
        expect(result).toBeDefined();
        expect(result.getName()).toEqual(wantedStudentName);
    });

    it('should update all students', async () => {
        const student1 = mockStudent();
        const student2 = mockStudent({ name: "test 2" });
        const entity1 = StudentMapper.fromDomain(student1);
        const entity2 = StudentMapper.fromDomain(student2);
        expect(await studentRepository.updateAll([entity1, entity2])).toBe(void 0);
        const students = await studentRepository.findAll();
        expect(students).toHaveLength(2);
    });

    it('findByIds test', async () => {
        const student1 = mockStudent();
        const entity1 = StudentMapper.fromDomain(student1);
        const wantedIds = [entity1.id];
        expect(await studentRepository.create(entity1)).toBeInstanceOf(Student);
        const result = await studentRepository.findByIds(wantedIds);
        expect(result).toHaveLength(1);
        expect(wantedIds.includes(result[0].getId())).toBeTruthy()
    }, 20000);

    it('should throw a QueryFailedError', async () => {
        const entity = new StudentEntity();
        await expect(studentRepository.create(null)).rejects.toThrow(QueryFailedError);
    });
});
