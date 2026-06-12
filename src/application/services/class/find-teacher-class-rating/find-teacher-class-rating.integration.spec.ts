import { Repository } from "typeorm";
import { StudentEntity } from "../../../../infrastructure/entities/student/student.entity";
import { StudentRepository } from "../../../../infrastructure/repositories/student/student.repository";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { ClassRepository } from "../../../../infrastructure/repositories/class/class.repository";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { FindTeacherClassRatingService } from './find-teacher-class-rating';
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { mockStudent } from "../../../../../tests/mocks/domain/student.mocks";
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";
import { ClassMapper } from "@/infrastructure/mappers/schoolgroup/class-mapper";
import { Worker } from "@/domain/worker/worker";
import { Class } from "@/domain/class/class";
import { Student } from "@/domain/student/student";

describe('FindTeacherClassRatingService integration test', () => {

    let studentRepository: StudentRepository;
    let workerEntity: Repository<WorkerEntity>;
    let wordRepository: WorkerRepository;
    let classEntity: Repository<ClassEntity>;
    let classRepository: ClassRepository;

    beforeAll(async () => {
        studentRepository = new StudentRepository(TestDataSource);
        workerEntity = TestDataSource.getRepository(WorkerEntity);
        wordRepository = new WorkerRepository(TestDataSource);
        classEntity = TestDataSource.getRepository(ClassEntity);
        classRepository = new ClassRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('all entities should be instantiated', async () => {
        expect(studentRepository).toBeDefined();
        expect(wordRepository).toBeDefined();
        expect(classRepository).toBeDefined();
    });

    it('should return a null value if teacherId and classId are not a match for a class entity', async () => {
        const teahcerId = 'f1c2b937-f4ed-4132-acbe-d91a3d6a4435';
        const classId = '38f81c2b-2586-432a-bad2-4dd576b69586';
        const service = new FindTeacherClassRatingService(classRepository);
        await expect(service.execute(teahcerId, classId)).rejects.toMatchObject({
            errors: [{ context: "class", message: "class not found." }]
        });
    });

    it('should find a classEntity', async () => {
        const student1 = mockStudent();
        const studentEntity = StudentMapper.fromDomain(student1);
        const student2 = mockStudent();
        const studentEntity2 = StudentMapper.fromDomain(student2);
        expect(await studentRepository.create(studentEntity)).toBeInstanceOf(Student);
        expect(await studentRepository.create(studentEntity2)).toBeInstanceOf(Student);

        const worker = mockWorker()
        const workerEntity = WorkerMapper.fromDomain(worker);
        expect(await wordRepository.create(workerEntity)).toBeInstanceOf(Worker);

        const classModel = mockClass()
        classModel.setTeacher(worker);
        classModel.setStudent(student1);
        classModel.setStudent(student2);
        const classEntity = ClassMapper.fromDomain(classModel);
        expect(await classRepository.create(classEntity)).toBeInstanceOf(Class);

        const teacherId = worker.getId();
        const classId = classModel.getId();
        const service = new FindTeacherClassRatingService(classRepository);
        const result = await service.execute(teacherId, classId);
        expect(result).toBeInstanceOf(Class);
        expect(result.getId()).toBe(classEntity.id);
        expect(result.getTeacher().getId()).toBe(worker.getId());
        expect(result.getStudents()).toHaveLength(2);
    });
});
