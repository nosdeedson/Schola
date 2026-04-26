import { Repository } from "typeorm";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { ClassRepository } from "../../../../infrastructure/repositories/class/class.repository";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { FindTeacherClassRatingService } from './find-teacher-class-rating';
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { RoleEnum } from "../../../../domain/worker/roleEnum";

describe('FindTeacherClassRatingService integration test', () => {

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

    it('all entities should be instantiated', async () => {
        expect(studentRepository).toBeDefined();
        expect(wordRepository).toBeDefined();
        expect(classRepository).toBeDefined();
    });

    it('should return a null value if teacherId and classId are not a match for a class entity', async () => {
        const teahcerId = 'f1c2b937-f4ed-4132-acbe-d91a3d6a4435';
        const classId = '38f81c2b-2586-432a-bad2-4dd576b69586';
        const service = new FindTeacherClassRatingService(classRepository);
        const result = await service.execute(teahcerId, classId);
        expect(result).toBeNull();
    });

    it('should find a classEntity', async () => {
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
        const classId = classModel.getId();
        const service = new FindTeacherClassRatingService(classRepository);
        const result = await service.execute(teacherId, classId);
        expect(result).toBeInstanceOf(ClassEntity);
        expect(result.id).toBe(classEntity.id);
        expect(result.teacher.id).toBe(worker.getId());
        expect(result.students).toHaveLength(2);
    });
});
