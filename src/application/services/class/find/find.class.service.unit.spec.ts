import { mockClass } from '../../../../../tests/mocks/domain/class.mocks';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { ClassEntity } from '../../../../infrastructure/entities/class/class.entity';
import { FindClassDto } from './find.class.dto';
import { FindClassService } from './find.class.service';


describe('find class service unit test', () => {

    afterEach( () => {
        jest.clearAllMocks();
    })

    it('should find a class', async () => {
        let schoolgroup = mockClass();
        let output = FindClassDto.toDto(schoolgroup);
        const findDto = jest.spyOn(FindClassDto, 'toDto')
            .mockReturnValue(output);
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.find = jest.fn()
            .mockImplementationOnce(() => {
                return schoolgroup;
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
            .mockReturnValue(new FindClassDto());
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.find = jest.fn()
            .mockImplementationOnce(() => {
                return null;
            });
        let wantedId = 'b5a0db75-f438-4fb6-9213-43c83fc5e8cc';
        const service = new FindClassService(classRepository);
        await expect(service.execute(wantedId)).rejects
            .toMatchObject({errors: [{
                context: 'class', message: 'class not found'}
            ]});
            expect(classRepository.find).toHaveBeenCalledTimes(1);
            expect(classRepository.find).toHaveBeenCalledWith(wantedId);
            expect(findDto).toHaveBeenCalledTimes(0);
    });

});