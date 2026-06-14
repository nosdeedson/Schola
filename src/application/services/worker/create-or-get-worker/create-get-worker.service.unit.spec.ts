import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { CreateGetWorkerService } from "./create-get-worker.service";
import { AccessType } from "@/domain/user/access.type";
import { CreateWorkerDto } from "../create/create.worker.dto";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { QueryFailedError } from "typeorm";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";
import { Worker } from "@/domain/worker/worker";

describe('CreateGetTeacher', () => {

    it('should find a teacher and return it', async () => {
        const worker = mockWorker();
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.findByName = jest.fn()
            .mockImplementation(() => Promise.resolve(worker));
        const service = new CreateGetWorkerService(workerRepository);
        const dto = new CreateWorkerDto({ classCode: '113', name: worker.getName(), birthday: new Date(), accessType: AccessType.TEACHER });
        const result = await service.execute(dto);
        expect(result).toBeInstanceOf(Worker);
        expect(result.getId()).toBe(worker.getId());
    });

    it('should create a teacher', async () => {
        const worker = mockWorker();
        const dto = new CreateWorkerDto({ classCode: '113', name: worker.getName(), birthday: new Date(), accessType: AccessType.TEACHER });
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.findByName = jest.fn().mockImplementationOnce(() => Promise.resolve(null));
        workerRepository.create = jest.fn().mockResolvedValue(worker);
        const service = new CreateGetWorkerService(workerRepository);
        expect(await service.execute(dto)).toBeInstanceOf(Worker);
        expect(workerRepository.create).toHaveBeenCalledTimes(1);
        expect(workerRepository.findByName).toHaveBeenCalledTimes(1);
    });

    it('should throw an QueryFailedError', async () => {
        const worker = mockWorker()
        const dto = new CreateWorkerDto({ classCode: '113', name: worker.getName(), birthday: new Date(), accessType: AccessType.TEACHER });
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.findByName = jest.fn().mockImplementationOnce(() => Promise.resolve(null));
        workerRepository.create = jest.fn()
            .mockImplementation(() => { throw new QueryFailedError(null, null, new Error("failed")) })
        const service = new CreateGetWorkerService(workerRepository);
        await expect(service.execute(dto)).rejects.toThrow(QueryFailedError);
    });
});
