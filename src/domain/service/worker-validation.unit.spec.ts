import { MockRepositoriesForUnitTest } from "../../../tests/mocks/mock-repositories/mockRepositories";
import { AccessType } from "../user/access.type";
import { WorkerValidation } from "./worker-validation";
import { SystemError } from '../../application/services/@shared/system-error';
import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { mockClass } from "../../../tests/mocks/domain/class.mocks";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { mockWorker } from "../../../tests/mocks/domain/worker.mock";

describe('WorkerValidation', () => {

    it('should return nothing id access type is student', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const workerValidation = new WorkerValidation(classRepository);
        expect(await workerValidation.validateWorker('123', 'name teacher', AccessType.STUDENT)).toBe(void 0);
    });

    it('should return nothing id access type is parent', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const workerValidation = new WorkerValidation(classRepository);
        expect(await workerValidation.validateWorker('123', 'name teacher', AccessType.PARENT)).toBe(void 0);
    });

    it('should return nothing id access type is admin', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const workerValidation = new WorkerValidation(classRepository);
        expect(await workerValidation.validateWorker('123', 'name teacher', AccessType.ADMIN)).toBe(void 0);
    });

    it('should throw SystemError if class is null', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.findByClassCode = jest.fn()
            .mockImplementation(() => Promise.resolve(null));
        const workerValidation = new WorkerValidation(classRepository);
        await expect(workerValidation.validateWorker('123', 'name teacher', AccessType.TEACHER))
            .rejects.toMatchObject(new SystemError([{ context: 'user', message: 'class not found' }], 404))
    });

    it("should throw SystemError if teacher name does not match the teacher's class", async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classEntity = ClassEntity.toClassEntity(mockClass());
        classEntity.setTeacher(WorkerEntity.toWorkerEntity(mockWorker()));
        classRepository.findByClassCode = jest.fn()
            .mockImplementation(() => Promise.resolve(classEntity));
        const workerValidation = new WorkerValidation(classRepository);
        await expect(workerValidation.validateWorker('123', 'name teacher', AccessType.TEACHER))
            .rejects.toMatchObject(new SystemError([{ context: 'user', message: 'You are not teaching in this class' }], 400))
    });

    it("should return anything", async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const classEntity = ClassEntity.toClassEntity(mockClass());
        classEntity.setTeacher(WorkerEntity.toWorkerEntity(mockWorker()));
        classRepository.findByClassCode = jest.fn()
            .mockImplementation(() => Promise.resolve(classEntity));
        const workerValidation = new WorkerValidation(classRepository);
        expect(await workerValidation.validateWorker('123', classEntity.teacher.fullName, AccessType.TEACHER)).toBe(void 0);
    });

});