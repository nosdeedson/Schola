import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { ClassRepository } from "../../../../infrastructure/repositories/class/class.repository"; 
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository"; 
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks"; 
import { UpdateClassDto } from './udpate.class.dto'
import { UpdateClassService } from './update.class.service';
import { Repository } from "typeorm";
import { TestDataSource } from '../../../../infrastructure/repositories/config-test/test.datasource';
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { RoleEnum } from "../../../../domain/worker/roleEnum";

describe('update class integration test', () =>{

    let classRepository: ClassRepository;
    let classEntity: Repository<ClassEntity>;
    let teacherEntity: Repository<WorkerEntity>;
    let teacherRepository: WorkerRepository

    beforeAll( async () =>{
        classEntity = TestDataSource.getRepository(ClassEntity);
        classRepository = new ClassRepository(classEntity, TestDataSource);
        teacherEntity = TestDataSource.getRepository(WorkerEntity);
        teacherRepository = new WorkerRepository(teacherEntity, TestDataSource);
    });

    afterEach( async () =>{
        jest.clearAllMocks();
    });

    it('entity and repository must be instantiated', async () =>{
        expect(classEntity).toBeDefined();
        expect(classRepository).toBeDefined();
        expect(teacherEntity).toBeDefined();
        expect(teacherRepository).toBeDefined();
    })

    it('should throw an error while updating class if id does not exist', async () =>{
        let schoolgroup = DomainMocks.mockSchoolGroup();
        let entity = ClassEntity.toClassEntity(schoolgroup);
        expect(await classRepository.create(entity)).toBeInstanceOf(ClassEntity);
        
        let wantedId = 'ea224f51-5404-4228-8a77-2795b900702d';
        let wantedBookName = 'new book';
        let wantedTeacher = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER));
        let input : UpdateClassDto = new UpdateClassDto(wantedId, wantedBookName, wantedTeacher);
        const service = new UpdateClassService(classRepository);
        try {
            await service.execute(input)
        } catch (error) {
            expect(error).toBeDefined();
            //@ts-ignore
            expect(error.errors).toMatchObject([{ "context": "class", "message": "class not found"}]);
        }
    });

    it('should update a class', async () =>{
        let teacher = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER, true));
        expect(await teacherRepository.create(teacher)).toBeInstanceOf(WorkerEntity);
        let schoolgroup = DomainMocks.mockSchoolGroup();
        let classEntity = ClassEntity.toClassEntity(schoolgroup);
        classEntity.teacher = teacher;
        const result = await classRepository.create(classEntity);

        expect(result).toBeInstanceOf(ClassEntity);
        let wantedId = result.id;
        let oldTeacherName = classEntity.teacher.fullName;
        let wantedBookName = 'new book';
        let wantedTeacher = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER));
        expect(await teacherRepository.create(wantedTeacher)).toBeInstanceOf(WorkerEntity);
        let input = new UpdateClassDto(wantedId, wantedBookName, wantedTeacher);
        
        const service = new UpdateClassService(classRepository);

        expect(await service.execute(input)).toBe(void 0);
        const afterUpdating = await classRepository.find(wantedId);

        expect(afterUpdating).toBeDefined();
        expect(afterUpdating.id).toBe(wantedId);
        expect(afterUpdating.bookName).toBe(input.nameBook);
        expect(afterUpdating.teacher.fullName).toBe(wantedTeacher.fullName);
        expect(afterUpdating.updatedAt.getTime()).toBeGreaterThan(schoolgroup.getUpdatedAt().getTime());
        expect(oldTeacherName).not.toBe(afterUpdating.teacher.fullName);
    });

});