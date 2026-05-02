import { Repository } from "typeorm";
import { ClassRepositoryInterface } from "../../../../domain/class/class.repository.interface";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { WorkerRepositoryInterface } from "../../../../domain/worker/worker.repository.interface";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { ClassRepository } from "../../../../infrastructure/repositories/class/class.repository";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { WorkerRepository } from "../../../../infrastructure/repositories/worker/worker.repository";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { CreateGetWorkerService } from "./create-get-worker.service";
import { AccessType } from "@/domain/user/access.type";
import { CreateWorkerDto } from "../create/create.worker.dto";

describe("CreateWorkerService integration test", () => {
    let workerEntity: Repository<WorkerEntity>;
    let workerRepository: WorkerRepositoryInterface;
    let schoolGroupEntity: Repository<ClassEntity>;
    let schoolGroupRepository: ClassRepositoryInterface;

    beforeAll(async () => {
        workerEntity = TestDataSource.getRepository(WorkerEntity);
        workerRepository = new WorkerRepository(TestDataSource);
        schoolGroupEntity = TestDataSource.getRepository(ClassEntity);
        schoolGroupRepository = new ClassRepository(TestDataSource) as ClassRepository;
    });

    it("repositories must be instantiated", async () => {
        expect(workerRepository).toBeDefined();
        expect(schoolGroupRepository).toBeDefined();
    })

    it('create a worker', async () => {
        let service = new CreateGetWorkerService(workerRepository);
        const dto = new CreateWorkerDto({ classCode: '113', name: "Mary Doe", birthday: new Date(), accessType: AccessType.TEACHER }); 
        const entity = await service.execute(dto);
        expect(entity).toBeInstanceOf(WorkerEntity);
        const validation = workerRepository.find(entity.id);
        expect(validation).toBeDefined();
    });

    it('should find a worker and return it', async () => {
        let service = new CreateGetWorkerService(workerRepository);
        let worker = DomainMocks.mockWorker(RoleEnum.TEACHER, true);
        let workerEntity = WorkerEntity.toWorkerEntity(worker);
        expect(await workerRepository.create(workerEntity)).toBeInstanceOf(WorkerEntity);
        const wantedBirthday = new Date();
        const dto = new CreateWorkerDto({ classCode: '113', name: worker.getName()}); 
        const entity = await service.execute(dto);
        expect(entity).toBeInstanceOf(WorkerEntity);
        const validation = await workerRepository.find(entity.id);
        expect(validation).toBeDefined();
        expect(validation.fullName).toBe(worker.getName());
    });
});
