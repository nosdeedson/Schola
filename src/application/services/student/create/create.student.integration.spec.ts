import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { ClassRepository } from "../../../../infrastructure/repositories/class/class.repository";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { CreateStudentService } from "../create/create.student.service";
import { CreateStudentDto } from '../create/create.student.dto';
import { ParentEntity } from "../../../../infrastructure/entities/parent/parent.entity";
import { ParentRepository } from "../../../../infrastructure/repositories/parent/parent.repository";
import { ParentStudentRepository } from "../../../../infrastructure/repositories/parent-student/parent.student.repositoy";
import { ParentStudentEntity } from "../../../../infrastructure/entities/parent-student/parent.student.entity";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { mockParent } from "../../../../../tests/mocks/domain/parent.mocks";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { ParentStudentMapper } from "@/infrastructure/mappers/parent-student/parent-student-mapper";
import { ParentMapper } from "@/infrastructure/mappers/parent/parent-mapper";
import { ClassMapper } from "@/infrastructure/mappers/schoolgroup/class-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { Class } from "@/domain/class/class";
import { Parent } from "@/domain/parent/parent";
import { Student } from "@/domain/student/student";

describe('CreateStudentService integration tests', () => {
    let studentRepository: StudentRepository;
    let schoolGroupRepository: ClassRepository;
    let parentRepository: ParentRepository;
    let parentStudentRepository: ParentStudentRepository;

    beforeEach(async () => {
        studentRepository = new StudentRepository(TestDataSource);
        schoolGroupRepository = new ClassRepository(TestDataSource);
        parentRepository = new ParentRepository(TestDataSource);
        parentStudentRepository = new ParentStudentRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('repositories must be instantiated', () => {
        expect(studentRepository).toBeDefined();
        expect(schoolGroupRepository).toBeDefined();
        expect(parentRepository).toBeDefined();
        expect(parentStudentRepository).toBeDefined();
    });

    it('should throw a SystemError if schollgroup not found', async () => {
        let dto = new CreateStudentDto(new Date(), 'edson', '123', ['marie']);
        const service = new CreateStudentService(studentRepository, schoolGroupRepository);
        await expect(service.execute(dto)).rejects
            .toMatchObject({ errors: [{ context: 'student', message: 'Schoolgroup not found' }] });
    });

    it('should update a student with birthday', async () => {
        // class 
        let schoogroup = mockClass();
        let sgEntity = ClassMapper.fromDomain(schoogroup);
        expect(await schoolGroupRepository.create(sgEntity)).toBeInstanceOf(Class);

        const parent = mockParent();
        const parentEntity = ParentMapper.fromDomain(parent);
        expect(await parentRepository.create(parentEntity)).toBeInstanceOf(Parent);

        let student = mockStudent();
        student.setSchoolGroup(schoogroup)
        let studentEntity = StudentMapper.fromDomain(student);
        studentEntity.birthday = null as any;
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);

        const parentStudent = ParentStudentMapper.fromDomain(parent, student);
        expect(await parentStudentRepository.create(parentStudent)).toBeInstanceOf(ParentStudentEntity);

        let dto = new CreateStudentDto(new Date(1980, 6, 30, 23, 59, 59), student.getName(), sgEntity.classCode, [parent.getName()]);
        const service = new CreateStudentService(studentRepository, schoolGroupRepository);
        expect(await service.execute(dto)).toBeInstanceOf(Student);
        const results = await studentRepository.findAll();
        expect(results[0].getBirthday()).toStrictEqual(new Date(1980, 6, 30, 23, 59, 59));
        expect(results[0].getName()).toBe(dto.name);
    });

    it('should create a student', async () => {
        let parent = mockParent();
        parent.setStudents([]);
        let parentModel = ParentMapper.fromDomain(parent);

        let schoogroup = mockClass();
        let sgEntity = ClassMapper.fromDomain(schoogroup);
        expect(await schoolGroupRepository.create(sgEntity)).toBeInstanceOf(Class);

        let dto = new CreateStudentDto(new Date(), 'edson', schoogroup.getClassCode(), [parent.getId()]);
        const service = new CreateStudentService(studentRepository, schoolGroupRepository);
        expect(await service.execute(dto)).toBeInstanceOf(Student);

    });

});
