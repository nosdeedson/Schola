import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { UpdateWorkerService } from "./udpate.worker.service";
import { InputUpdateWorkerDto } from './update.worker.dto'
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { mockWorker } from "../../../../../tests/mocks/domain/worker.mock";
import { mockInputUpdateWoker } from "../../../../../tests/mocks/services/update-worker-dto.mocks";


describe('UpdateWorkerService unit test', () => {

    afterEach(async () => { jest.clearAllMocks() })
    it('should update a worker', async () => {
        let input = mockInputUpdateWoker();
        const worker = mockWorker();
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.update = jest.fn().mockReturnValue(await Promise.resolve(void 0));
        workerRepository.find = jest.fn().mockReturnValue(Promise.resolve(worker));
        const service = new UpdateWorkerService(workerRepository);
        expect(await service.execute(input)).toBe(void 0);
        expect(workerRepository.update).toHaveBeenCalledTimes(1)
    });

    it('should thorw  an error about null name', async () => {
        let input = mockInputUpdateWoker()
        const worker = mockWorker();
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.update = jest.fn().mockReturnValue(await Promise.resolve(void 0));
        workerRepository.find = jest.fn().mockReturnValue(Promise.resolve(worker));
        const service = new UpdateWorkerService(workerRepository);
        let emptyName: any;
        input.name = emptyName;
        await expect(service.execute(input)).rejects
            .toMatchObject({ errors: [{ context: 'worker', message: 'teacher: Name should not be null,' }] });
    });

    it('should thorw  an error about null role', async () => {
        let input = mockInputUpdateWoker()
        const worker = mockWorker();
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.update = jest.fn().mockReturnValue(await Promise.resolve(void 0));
        workerRepository.find = jest.fn().mockReturnValue(Promise.resolve(worker));
        const service = new UpdateWorkerService(workerRepository);
        let emptyRole: any;
        input.role = emptyRole;
        await expect(service.execute(input)).rejects
            .toMatchObject({ errors: [{ context: 'worker', message: 'teacher: Role should not be null,' }] });
    });
});
