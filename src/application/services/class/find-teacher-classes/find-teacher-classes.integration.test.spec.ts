import { Repository } from "typeorm";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { ClassRepository } from "../../../../infrastructure/repositories/class/class.repository";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { FindTeacherClassesService } from './find.teacher-classes';
import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks'
import { RoleEnum } from "../../../../domain/worker/roleEnum";

describe('FindTeacherClass integration test', () => {

    let studendtEntity: Repository<StudentEntity>;
    let studentRepository: StudentRepository;
    let workerEntity: Repository<WorkerEntity>;
    let wordRepository: WorkerRepository;
    let classEntity: Repository<ClassEntity>;
    let classRepository: ClassRepository;

    beforeAll(async () => {
        studendtEntity = TestDataSource.getRepository(StudentEntity);
        studentRepository = new StudentRepository(studendtEntity, TestDataSource);
        workerEntity = TestDataSource.getRepository(WorkerEntity);
        wordRepository = new WorkerRepository(workerEntity, TestDataSource);
        classEntity = TestDataSource.getRepository(ClassEntity);
        classRepository = new ClassRepository(TestDataSource);
    });

    it('all variables must be instantiated', () => {
        expect(studentRepository).toBeDefined();
        expect(wordRepository).toBeDefined();
        expect(classRepository).toBeDefined();
    });

    it('Should find an empty array when idTeacher is not related with any class', async () => {
        const teacherId = '61834720-951a-42c0-80d7-702010101010';
        const findClassesService = new FindTeacherClassesService(classRepository);
        const result = await findClassesService.execute(teacherId);
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });

    it('Should find all classes related to the teacher id', async () => {
        const student1 = DomainMocks.mockStudent();
        const studentEntity = StudentEntity.toStudentEntity(student1);
        const student2 = DomainMocks.mockStudentWithoutParent();
        const studentEntity2 = StudentEntity.toStudentEntity(student2);
        expect(await studentRepository.create(studentEntity));
        expect(await studentRepository.create(studentEntity2));

        const worker = DomainMocks.mockWorker(RoleEnum.TEACHER);
        const workerEntity = WorkerEntity.toWorkerEntity(worker);
        expect(await wordRepository.create(workerEntity));

        const classModel = DomainMocks.mockSchoolGroup();
        classModel.setTeacher(worker);
        classModel.setStudent(student1);
        classModel.setStudent(student2);
        const classEntity = ClassEntity.toClassEntity(classModel);
        expect(await classRepository.create(classEntity));

        const teacherId = worker.getId();
        const findClassesService = new FindTeacherClassesService(classRepository);
        const result = await findClassesService.execute(teacherId);
        expect(result).toHaveLength(1);
        expect(result[0].students).toHaveLength(2);
        expect(result[0].students[0].idStudent).toBe(student1.getId());
        expect(result[0].students[1].idStudent).toBe(student2.getId());
        expect(result[0].classId).toBe(classModel.getId());
    });

});
