import { UpdateClassDto } from './udpate.class.dto';
import { UpdateClassService } from './update.class.service';
import { MockRepositoriesForUnitTest } from '../../../../infrastructure/__mocks__/mockRepositories';
import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';
import { ClassEntity } from '../../../../infrastructure/entities/class/class.entity';
import { WorkerEntity } from '../../../../infrastructure/entities/worker/worker.entity';
import { RoleEnum } from '../../../../domain/worker/roleEnum';

describe('update class service unit test', () =>{

    afterEach(() =>{
        jest.clearAllMocks();
    })

    it('should throw an error if passing invalid id', async () =>{
        let nonExistentId = '123';
        let wantedBookName = 'bookb1';
        let newTeacher = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER));
        let input = new UpdateClassDto(nonExistentId, wantedBookName, newTeacher);
        
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.find = jest.fn().mockImplementationOnce(() => {return null});
        const service = new UpdateClassService(classRepository);
        try {
            await service.execute(input)
        } catch (error) {
            //@ts-ignore
            expect(error.errors).toMatchObject([{ "context": "class", "message": "class not found"}]);
            expect(classRepository.find).toHaveBeenCalledTimes(1);
            expect(classRepository.find).toHaveBeenCalledWith(input.id);
            expect(classRepository.update).toHaveBeenCalledTimes(0);
        }
    });

    it('should update a class', async () =>{
        const schoolgroup = DomainMocks.mockSchoolGroup();
        const entity = ClassEntity.toClassEntity(schoolgroup);
        const newTeacher = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER));
        let wantedId = schoolgroup.getId();
        let wantedBookName = 'bookb1';
        let input = new UpdateClassDto(wantedId, wantedBookName, newTeacher);
        
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.find = jest.fn().mockImplementationOnce(() => {return entity});
        classRepository.update = jest.fn().mockImplementationOnce(() => {entity.bookName = wantedBookName, entity.teacher = newTeacher});
        const service = new UpdateClassService(classRepository);

        expect(await service.execute(input)).toBe(void 0);
        expect(classRepository.find).toHaveBeenCalledWith(input.id);
        expect(classRepository.find).toHaveBeenCalledTimes(1);
        expect(classRepository.update).toHaveBeenCalledTimes(1);
        expect(classRepository.update).toHaveBeenCalledWith(entity);
    });

})