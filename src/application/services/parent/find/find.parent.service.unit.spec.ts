import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { FindParentService } from './find.parent.service';
import { mockParent } from '../../../../../tests/mocks/domain/parent.mocks';
import { ParentMapper } from '@/infrastructure/mappers/parent/parent-mapper';


describe('FindParentService unit tests', () => {

    it('should throw a systemError with parent not found', async () => {
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        parentRepository.find = jest.fn().mockImplementationOnce(() => { return null });
        const service = new FindParentService(parentRepository);
        const wantedId = '1234'
        await expect(service.execute(wantedId)).rejects.toMatchObject({
            errors: [{
                context: 'parent',
                message: 'Parent not found'
            }]
        });
    })

    it('should find a parent', async () => {
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const parent = mockParent();
        parentRepository.find = jest.fn().mockImplementationOnce(() => { return parent });
        const wantedId = parent.getId();
        const service = new FindParentService(parentRepository);
        let result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId);
    });
});
