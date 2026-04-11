import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity"
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";
import { StudentRepository } from "@/infrastructure/repositories/student/student.repository";
import { Repository } from "typeorm"
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { UpdateAllStudentsService } from "./update-all-students.service";

describe('UpdateAllStudentsService integration tests', () => {
    let studentEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;
    let classEntity: Repository<ClassEntity>;
    let classRepository: ClassRepository;

    beforeAll(async () => {
        studentEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studentEntity, TestDataSource);
        classEntity = TestDataSource.getRepository(ClassEntity);
        classRepository = new ClassRepository(classEntity, TestDataSource);
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
        const firstClass = ClassEntity.toClassEntity(class1);
        expect(await classRepository.create(firstClass)).toBeInstanceOf(ClassEntity);

        const class2 = mockClass({ name: 'second class' });
        const secondClass = ClassEntity.toClassEntity(class2);
        expect(await classRepository.create(secondClass)).toBeInstanceOf(ClassEntity);

        const studentEntity1 = StudentEntity.toStudentEntity(mockStudent());
        studentEntity1.schoolGroup = firstClass;
        expect(await studentRepository.create(studentEntity1)).toBeInstanceOf(StudentEntity);

        const studentEntity2 = StudentEntity.toStudentEntity(mockStudent({ name: 'test 2' }));
        studentEntity2.schoolGroup = firstClass;
        expect(await studentRepository.create(studentEntity2)).toBeInstanceOf(StudentEntity);

        const beforeUpdating = await studentRepository.findAll();
        expect(beforeUpdating[0].schoolGroup.id).toBe(firstClass.id);
        expect(beforeUpdating[1].schoolGroup.id).toBe(firstClass.id);

        beforeUpdating.forEach(it => it.schoolGroup = secondClass)
        const updateAllStudentsService = new UpdateAllStudentsService(studentRepository);
        expect(await updateAllStudentsService.execute(beforeUpdating)).toBe(void 0);
        const afterUpdating = await studentRepository.findAll();
        expect(afterUpdating[0].schoolGroup.id).toBe(secondClass.id);
        expect(afterUpdating[1].schoolGroup.id).toBe(secondClass.id);
    }, 100000);
})
