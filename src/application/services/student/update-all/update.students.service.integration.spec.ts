import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity"
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { StudentRepository } from "@/infrastructure/repositories/student/student.repository";
import { Repository } from "typeorm"
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { UpdateAllStudentsService } from "./update-all-students.service";
import { ClassMapper } from "@/infrastructure/mappers/schoolgroup/class-mapper";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { Class } from "@/domain/class/class";
import { Student } from "@/domain/student/student";

describe('UpdateAllStudentsService integration tests', () => {
    let studentRepository: StudentRepository;
    let classRepository: ClassRepository;

    beforeAll(async () => {
        studentRepository = new StudentRepository(TestDataSource);
        classRepository = new ClassRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should all repositories to be defined', async () => {
        expect(studentRepository).toBeDefined();
        expect(classRepository).toBeDefined();
    });

    it('should update all students', async () => {
        const class1 = mockClass();
        const firstClass = ClassMapper.fromDomain(class1);
        expect(await classRepository.create(firstClass)).toBeInstanceOf(Class);

        const class2 = mockClass({ name: 'second class' });
        const secondClass = ClassMapper.fromDomain(class2);
        expect(await classRepository.create(secondClass)).toBeInstanceOf(Class);

        const studentEntity1 = StudentMapper.fromDomain(mockStudent());
        studentEntity1.schoolGroup = firstClass;
        expect(await studentRepository.create(studentEntity1)).toBeInstanceOf(Student);

        const studentEntity2 = StudentMapper.fromDomain(mockStudent({ name: 'test 2' }));
        studentEntity2.schoolGroup = firstClass;
        expect(await studentRepository.create(studentEntity2)).toBeInstanceOf(Student);

        const beforeUpdating = await studentRepository.findAll();
        expect(beforeUpdating[0].getSchoolGroup().getId()).toBe(firstClass.id);
        expect(beforeUpdating[1].getSchoolGroup().getId()).toBe(firstClass.id);

        beforeUpdating.forEach(it => it.setSchoolGroup(class2))
        const updateAllStudentsService = new UpdateAllStudentsService(studentRepository);
        expect(await updateAllStudentsService.execute(beforeUpdating)).toBe(void 0);
        const afterUpdating = await studentRepository.findAll();
        expect(afterUpdating[0].getSchoolGroup().getId()).toBe(secondClass.id);
        expect(afterUpdating[1].getSchoolGroup().getId()).toBe(secondClass.id);
    });
});
