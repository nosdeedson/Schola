import { Worker } from "../../../../domain/worker/worker";
import { RoleEnum } from "../../../../domain/worker/roleEnum";
import { UpdateWorkerService } from "./udpate.worker.service";
import { InputUpdateWorkerDto } from './update.worker.dto'
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";


describe('UpdateWorkerService unit test', () =>{

    let workerEntity: WorkerEntity;
    let input : InputUpdateWorkerDto;

    beforeEach(() =>{
        let w = new Worker({
            birthday: new Date(),
            name: 'edson',
            role: RoleEnum.ADMINISTRATOR,
            id: '123',
            createdAt: new Date(),
            updatedAt: new Date(),
    });

        workerEntity = WorkerMapper.fromDomain(w);

        input = {
            id: '123',
            name: 'edson jose',
            role : RoleEnum.TEACHER
        }
         
    });
    
    it('should update a worker', async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.update = jest.fn().mockReturnValue(await Promise.resolve(void 0));
        workerRepository.find = jest.fn().mockReturnValue(Promise.resolve(workerEntity));
        const service = new UpdateWorkerService(workerRepository);
        expect(await service.execute(input)).toBe(void 0);
        expect(workerRepository.update).toHaveBeenCalledTimes(1)
    });

    it('should thorw  an error about null name', async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.update = jest.fn().mockReturnValue(await Promise.resolve(void 0));
        workerRepository.find = jest.fn().mockReturnValue(Promise.resolve(workerEntity));
        const service = new UpdateWorkerService(workerRepository);
        try {
            let emptyName: any;
            input.name = emptyName;
            expect(await service.execute(input)).toBe(void 0);
        } catch (error) {
            //@ts-ignore
            expect(error.message).toBe('teacher: Name should not be null,')
        }
    });

    it('should thorw  an error about null role', async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.update = jest.fn().mockReturnValue(await Promise.resolve(void 0));
        workerRepository.find = jest.fn().mockReturnValue(Promise.resolve(workerEntity));
        const service = new UpdateWorkerService(workerRepository);
        try {
            let emptyRole: any;
            input.role = emptyRole;
            expect(await service.execute(input)).toBe(void 0);
        } catch (error) {
            //@ts-ignore
            expect(error.message).toBe('teacher: Role should not be null,')
        }
    });
});
