import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { ClassRepository } from "../../../../infrastructure/repositories/class/class.repository";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { UpdateClassDto } from './udpate.class.dto'
import { UpdateClassService } from './update.class.service';
import { Repository } from "typeorm";
import { TestDataSource } from '../../../../infrastructure/repositories/config-test/test.datasource';
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { ClassMapper } from "@/infrastructure/mappers/schoolgroup/class-mapper";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";
import { Class } from "@/domain/class/class";
import { Worker } from "@/domain/worker/worker";

describe('update class integration test', () => {

    let classRepository: ClassRepository;
    let classEntity: Repository<ClassEntity>;
    let teacherEntity: Repository<WorkerEntity>;
    let teacherRepository: WorkerRepository

    beforeAll(async () => {
        classEntity = TestDataSource.getRepository(ClassEntity);
        classRepository = new ClassRepository(TestDataSource);
        teacherEntity = TestDataSource.getRepository(WorkerEntity);
        teacherRepository = new WorkerRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('entity and repository must be instantiated', async () => {
        expect(classEntity).toBeDefined();
        expect(classRepository).toBeDefined();
        expect(teacherEntity).toBeDefined();
        expect(teacherRepository).toBeDefined();
    })

    it('should throw an error while updating class if id does not exist', async () => {
        let schoolgroup = mockClass();
        let entity = ClassMapper.fromDomain(schoolgroup);
        expect(await classRepository.create(entity)).toBeInstanceOf(Class);

        let wantedId = 'ea224f51-5404-4228-8a77-2795b900702d';
        let wantedBookName = 'new book';
        let wantedTeacher = WorkerMapper.fromDomain(mockWorker());
        let input: UpdateClassDto = new UpdateClassDto(wantedId, wantedBookName, wantedTeacher);
        const service = new UpdateClassService(classRepository);
        await expect(service.execute(input)).rejects
            .toMatchObject({errors: [
                { "context": "class", "message": "class not found" }
            ]})
    });

    it('should update a class', async () => {
        let teacher = WorkerMapper.fromDomain(mockWorker());
        expect(await teacherRepository.create(teacher)).toBeInstanceOf(Worker);
        let schoolgroup = mockClass();
        let classEntity = ClassMapper.fromDomain(schoolgroup);
        classEntity.teacher = teacher;
        expect(await classRepository.create(classEntity)).toBeInstanceOf(Class);
        let wantedId = classEntity.id;
        let oldTeacherName = classEntity.teacher.fullName;
        let wantedBookName = 'new book';
        let wantedTeacher = WorkerMapper.fromDomain(mockWorker({name: 'Emily'}));
        expect(await teacherRepository.create(wantedTeacher)).toBeInstanceOf(Worker);
        let input = new UpdateClassDto(wantedId, wantedBookName, wantedTeacher);

        const service = new UpdateClassService(classRepository);

        expect(await service.execute(input)).toBe(void 0);
        const afterUpdating = await classRepository.find(wantedId);

        expect(afterUpdating).toBeDefined();
        expect(afterUpdating.getId()).toBe(wantedId);
        expect(afterUpdating.getNameBook()).toBe(input.nameBook);
        expect(afterUpdating.getTeacher().getName()).toBe(wantedTeacher.fullName);
        expect(afterUpdating.getUpdatedAt().getTime()).toBeGreaterThan(schoolgroup.getUpdatedAt().getTime());
        expect(oldTeacherName).not.toBe(afterUpdating.getTeacher().getName());
    });

});
