import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';
import { ClassEntity } from '../../../../infrastructure/entities/class/class.entity';
import { FindClassDto } from './find.class.dto';
import { FindClassService } from './find.class.service';


describe('find class service unit test', () => {

    let schoolgroup;
    let entity: ClassEntity | undefined;
    let output: FindClassDto;

    afterEach( () => {
        schoolgroup = undefined;
        entity = undefined;
        jest.clearAllMocks();
    })

    it('should find a class', async () => {
        schoolgroup = DomainMocks.mockSchoolGroup();
        entity = ClassEntity.toClassEntity(schoolgroup);
        output = FindClassDto.toDto(entity);
        const findDto = jest.spyOn(FindClassDto, 'toDto')
            .mockReturnValue(output);
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.find = jest.fn()
            .mockImplementationOnce(() => {
                return entity;
            });
        let wantedId = schoolgroup.getId();
        const service = new FindClassService(classRepository);
        let result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(classRepository.find).toHaveBeenCalledTimes(1);
        expect(classRepository.find).toHaveBeenCalledWith(wantedId);
        expect(findDto).toHaveBeenCalled();
    });

    it('should not find a class with invalid id', async () => {
        const findDto = jest.spyOn(FindClassDto, 'toDto')
            .mockReturnValue(output);
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.find = jest.fn()
            .mockImplementationOnce(() => {
                return null;
            });
        let wantedId = 'b5a0db75-f438-4fb6-9213-43c83fc5e8cc';
        const service = new FindClassService(classRepository);
        try {
            await service.execute(wantedId)
        } catch (error) {
            //@ts-ignore
            expect(error.errors).toBeDefined();
            //@ts-ignore
            expect(error.errors).toStrictEqual([{context: 'class', message: 'class not found'}])
            expect(classRepository.find).toHaveBeenCalledTimes(1);
            expect(classRepository.find).toHaveBeenCalledWith(wantedId);
            expect(findDto).toHaveBeenCalledTimes(0);
        }
    })

})