import { RoleEnum } from "../../../../domain/worker/roleEnum"
import { MockRepositoriesForUnitTest } from "../../../../infrastructure/__mocks__/mockRepositories";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { CreateWorkerDto } from "./create.worker.dto"
import { CreateWorkerService }  from "./create.worker.service"
import { SystemError } from '../../@shared/system-error'
import { AccessType } from "../../../../domain/user/access.type";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { WorkerEntity } from "../../../../infrastructure/entities/worker/worker.entity";

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
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.findByClassCode = jest.fn().mockImplementationOnce(
            () => {
                return ClassEntity.toClassEntity(DomainMocks.mockSchoolGroup());
            }
        );
        workerRepository.findByName = jest.fn().mockImplementationOnce(() => Promise.resolve(null));
        workerRepository.create = jest.fn().mockResolvedValue(WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER)));
        const service = new CreateWorkerService(workerRepository, classRepository );
        expect(await service.execute(worker)).toBeInstanceOf(WorkerEntity);
        expect(workerRepository.create).toHaveBeenCalledTimes(1);
        expect(workerRepository.findByName).toHaveBeenCalledTimes(1);
        expect(classRepository.findByClassCode).toHaveBeenCalledTimes(1);
    });

    it("should throw error name should not be null", async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.findByClassCode = jest.fn().mockImplementationOnce(
            () => {
                return ClassEntity.toClassEntity(DomainMocks.mockSchoolGroup());
            }
        );
        workerRepository.findByName = jest.fn().mockImplementationOnce(() => Promise.resolve(null));
        worker.name = '';
        const service = new CreateWorkerService(workerRepository,classRepository );
        try {
            await service.execute(worker);
        } catch (error) {
            //@ts-ignore
            expect(error.errors[0].message).toBe("Name should not be null")
        }
    });

    it("should throw error teacher should not be null", async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.findByClassCode = jest.fn().mockImplementationOnce(
            () => {
                return {}
            }
        );
        workerRepository.findByName = jest.fn().mockImplementationOnce(() => Promise.resolve(null));
        let nothing: any;
        worker.role = nothing;
        const service = new CreateWorkerService(workerRepository, classRepository);
        try {
            await service.execute(worker);
        } catch (error) {
            //@ts-ignore
            expect(error.errors[0].message).toBe("Role should not be null")
        }
    })

    it("should throw database not available", async () => {
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.findByClassCode = jest.fn().mockImplementationOnce(
            () => {
                return {}
            }
        );
        workerRepository.findByName = jest.fn().mockImplementationOnce(() => Promise.resolve(null));
        workerRepository.create = jest.fn().mockImplementationOnce( () => {
            throw new SystemError([{context: 'teacher', message: "database not available"}]); 
        })
        const service = new CreateWorkerService(workerRepository, classRepository);
        try {
            await service.execute(worker)
        } catch (error) {
            //@ts-ignore
            expect(error.errors[0].message).toBe('database not available')
        }
    });

    it('should update an existing teacher', async () => {
        const worker = DomainMocks.mockWorker(RoleEnum.TEACHER, true);
        const entity = WorkerEntity.toWorkerEntity(worker);
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.findByName = jest.fn().mockImplementationOnce(() => Promise.resolve(entity));
        workerRepository.update = jest.fn().mockImplementationOnce(() => Promise.resolve(entity));
        const service = new CreateWorkerService(workerRepository, classRepository);
        const dto = new CreateWorkerDto({ classCode: '113', name: entity.fullName, birthday: new Date(), accessType: AccessType.TEACHER})
        expect(await service.execute(dto)).toBeInstanceOf(WorkerEntity);
        expect(workerRepository.update).toHaveBeenCalledTimes(1);
        expect(workerRepository.findByName).toHaveBeenCalledTimes(1);
    });
});