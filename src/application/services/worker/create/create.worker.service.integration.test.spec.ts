import { Repository } from "typeorm";
import { ClassRepositoryInterface } from "../../../../domain/class/class.repository.interface";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { WorkerRepositoryInterface } from "../../../../domain/worker/worker.repository.interface";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { ClassRepository } from "../../../../infrastructure/repositories/class/class.repository";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { CreateWorkerDto } from "./create.worker.dto";
import { CreateWorkerService } from "./create.worker.service";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";

describe("CreateWorkerService integration test", () =>{
    let workerEntity: Repository<WorkerEntity>;
    let workerRepository: WorkerRepositoryInterface;
    let schoolGroupEntity: Repository<ClassEntity>;
    let schoolGroupRepository: ClassRepositoryInterface; 

    beforeAll(async () => {
        workerEntity = TestDataSource.getRepository(WorkerEntity);
        workerRepository = new WorkerRepository(workerEntity, TestDataSource);
        schoolGroupEntity = TestDataSource.getRepository(ClassEntity);
        schoolGroupRepository = new ClassRepository(schoolGroupEntity, TestDataSource) as ClassRepository;
    });
            
    it("repositories must be instantiated", async () =>{
        expect(workerRepository).toBeDefined();
        expect(schoolGroupRepository).toBeDefined();
    })

    it('create a worker', async () =>{
        let service = new CreateWorkerService(workerRepository, schoolGroupRepository);
        let worker =  {
            name: 'edson',
            birthday: new Date(),
            role: RoleEnum.TEACHER,
            classCode: null as any,
        } as CreateWorkerDto;
        const entity = await service.execute(worker);
        expect(entity).toBeInstanceOf(WorkerEntity);
        const validation = workerRepository.find(entity.id);
        expect(validation).toBeDefined();
    });

    it('should create a teacher with just a name', async () => {
        let service = new CreateWorkerService(workerRepository, schoolGroupRepository);
        let teacher = {
            name: 'just name',
            role: RoleEnum.TEACHER
        } as CreateWorkerDto;
        const entity = await service.execute(teacher) as WorkerEntity;
        expect(entity).toBeInstanceOf(WorkerEntity);
        const validation = workerRepository.find(entity.id);
        expect(validation).toBeDefined();
    });

    it('should create a worker with class code', async () => {
        let service = new CreateWorkerService(workerRepository, schoolGroupRepository);
        let worker = DomainMocks.mockWorker(RoleEnum.TEACHER, true);
        let workerEntity = WorkerEntity.toWorkerEntity(worker);
        expect(await workerRepository.create(workerEntity)).toBeInstanceOf(WorkerEntity);
        const wantedBirthday = new Date();
        let dto = {
            name: worker.getName(),
            role: RoleEnum.TEACHER,
            classCode: '123456',
            birthday: wantedBirthday,
        } as CreateWorkerDto;
        const entity = await service.execute(dto);
        expect(entity).toBeInstanceOf(WorkerEntity);
        const validation = await workerRepository.find(entity.id);
        expect(validation).toBeDefined();
        expect(validation.fullName).toBe(worker.getName());
        expect(validation.birthday.getTime()).toBe(wantedBirthday.getTime());
    });
});