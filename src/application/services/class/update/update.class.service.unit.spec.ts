import { UpdateClassDto } from './udpate.class.dto';
import { UpdateClassService } from './update.class.service';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { mockWorker } from '../../../../../tests/mocks/domain/worker.mock';
import { mockClass } from '../../../../../tests/mocks/domain/class.mocks';
import { WorkerMapper } from '@/infrastructure/mappers/worker/worker-mapper';
import { ClassMapper } from '@/infrastructure/mappers/schoolgroup/class-mapper';

describe('update class service unit test', () => {

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should throw an error if passing invalid id', async () => {
        let nonExistentId = '123';
        let wantedBookName = 'bookb1';
        let newTeacher = WorkerMapper.fromDomain(mockWorker());
        let input = new UpdateClassDto(nonExistentId, wantedBookName, mockWorker());

        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.find = jest.fn().mockImplementationOnce(() => { return null });
        const service = new UpdateClassService(classRepository);
        await expect(service.execute(input)).rejects
            .toMatchObject({ errors: [{ "context": "class", "message": "class not found" }] });
    });

    it('should update a class', async () => {
        const schoolgroup = mockClass();
        const entity = ClassMapper.fromDomain(schoolgroup);
        const newTeacher = WorkerMapper.fromDomain(mockWorker());
        let wantedId = schoolgroup.getId();
        let wantedBookName = 'bookb1';
        let input = new UpdateClassDto(wantedId, wantedBookName, mockWorker());

        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.find = jest.fn().mockImplementationOnce(() => { return schoolgroup });
        classRepository.update = jest.fn().mockImplementationOnce(() => { entity.bookName = wantedBookName, entity.teacher = newTeacher });
        const service = new UpdateClassService(classRepository);

        expect(await service.execute(input)).toBe(void 0);
        expect(classRepository.find).toHaveBeenCalledWith(input.id);
        expect(classRepository.find).toHaveBeenCalledTimes(1);
        expect(classRepository.update).toHaveBeenCalledTimes(1);
    });

})
