import { RoleEnum } from "@/domain/worker/roleEnum";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { CreateGetWorkerService } from "./create-get-worker.service";
import { AccessType } from "@/domain/user/access.type";
import { CreateWorkerDto } from "../create/create.worker.dto";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";

describe('CreateGetTeacher', () => {

    it('should find a teacher and return it', async () => {
        const worker = mockWorker();
        const entity = WorkerEntity.toWorkerEntity(worker);
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.findByName = jest.fn()
            .mockImplementation(() => Promise.resolve(entity));
        const service = new CreateGetWorkerService(workerRepository);
        const dto = new CreateWorkerDto({ classCode: '113', name: entity.fullName, birthday: new Date(), accessType: AccessType.TEACHER });
        const result = await service.execute(dto);
        expect(result).toBeInstanceOf(WorkerEntity);
        expect(result.id).toBe(worker.getId());
    });

    it('should create a teacher', async () => {
        const entity = WorkerEntity.toWorkerEntity(mockWorker())
        const dto = new CreateWorkerDto({ classCode: '113', name: entity.fullName, birthday: new Date(), accessType: AccessType.TEACHER }); 
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.findByName = jest.fn().mockImplementationOnce(() => Promise.resolve(null));
        workerRepository.create = jest.fn().mockResolvedValue(entity);
        const service = new CreateGetWorkerService(workerRepository);
        expect(await service.execute(dto)).toBeInstanceOf(WorkerEntity);
        expect(workerRepository.create).toHaveBeenCalledTimes(1);
        expect(workerRepository.findByName).toHaveBeenCalledTimes(1);
    });
});