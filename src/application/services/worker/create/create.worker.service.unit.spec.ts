import { RoleEnum } from "../../../../domain/worker/roleEnum"
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { CreateWorkerDto } from "./create.worker.dto"
import { CreateWorkerService } from "./create.worker.service"
import { SystemError } from '../../@shared/system-error'
import { AccessType } from "../../../../domain/user/access.type";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { Worker } from "@/domain/worker/worker";

describe('CreateWorkerService test unit', () => {
    let worker: CreateWorkerDto;

    beforeEach(() => {
        worker = {
            name: 'edson',
            birthday: new Date(),
            role: RoleEnum.TEACHER,
            classCode: '12343',
        }
    })

    it("should create a worker", async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();

        workerRepository.findByName = jest.fn().mockImplementationOnce(() => Promise.resolve(null));
        workerRepository.create = jest.fn().mockResolvedValue(mockWorker());
        const service = new CreateWorkerService(workerRepository);
        expect(await service.execute(worker)).toBeInstanceOf(Worker);
        expect(workerRepository.create).toHaveBeenCalledTimes(1);
        expect(workerRepository.findByName).toHaveBeenCalledTimes(1);
    });

    it("should throw error name should not be null", async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.findByName = jest.fn().mockImplementationOnce(() => Promise.resolve(null));
        worker.name = '';
        const service = new CreateWorkerService(workerRepository);
        await expect(service.execute(worker)).rejects.toMatchObject({
            errors:
                [{ context: 'teacher', message: "Name should not be null" }]
        });
    });

    it("should throw error teacher should not be null", async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.findByName = jest.fn().mockImplementationOnce(() => Promise.resolve(null));
        let nothing: any;
        worker.role = nothing;
        const service = new CreateWorkerService(workerRepository);
        await expect(service.execute(worker)).rejects.toMatchObject({
            errors:
                [{ context: 'teacher', message: "Role should not be null" }]
        });
    });

    it("should throw database not available", async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.findByName = jest.fn().mockImplementationOnce(() => Promise.resolve(null));
        workerRepository.create = jest.fn().mockImplementationOnce(() => {
            throw new SystemError([{ context: 'teacher', message: "database not available" }], 500);
        })
        const service = new CreateWorkerService(workerRepository);
        await expect(service.execute(worker)).rejects.toMatchObject({
            errors:
                [{ context: 'teacher', message: "database not available" }]
        });
    });

    it('should update an existing teacher', async () => {
        const worker = mockWorker();
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.findByName = jest.fn().mockImplementationOnce(() => Promise.resolve(worker));
        workerRepository.create = jest.fn().mockImplementationOnce(() => Promise.resolve(worker));
        const service = new CreateWorkerService(workerRepository);
        const dto = new CreateWorkerDto({ classCode: '113', name: worker.getName(), birthday: new Date(), accessType: AccessType.TEACHER });
        expect(await service.execute(dto)).toBeInstanceOf(Worker);
        expect(workerRepository.create).toHaveBeenCalledTimes(1);
        expect(workerRepository.findByName).toHaveBeenCalledTimes(1);
    });
});
