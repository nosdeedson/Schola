import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { DeleteParentService } from './delete.parent.service';
import { ParentEntity } from '../../../../infrastructure/entities/parent/parent.entity';
import { mockParent } from '../../../../../tests/mocks/domain/parent.mocks';
import { QueryFailedError } from 'typeorm';
import { ParentMapper } from '@/infrastructure/mappers/parent/parent-mapper';


describe('DeleteParentService unit tests', () => {

    it('should not throw error when trying to delete a parent with nos-existent id', async () => {

        let parent = mockParent();
        let entity = ParentMapper.fromDomain(parent);

        let parentRepository = MockRepositoriesForUnitTest.mockRepositories();

        parentRepository.delete = jest.fn().mockImplementationOnce(() => { return void 0 });

        const service = new DeleteParentService(parentRepository);
        expect(await service.execute('1234')).toBe(void 0);
        expect(parentRepository.delete).toHaveBeenCalledTimes(1);
        expect(parentRepository.delete).toHaveBeenCalledWith('1234');
    });

    it('should delete a parent', async () => {
        let parent = mockParent();
        let entity = ParentMapper.fromDomain(parent);

        let wantedId = parent.getId();

        let parentRepository = MockRepositoriesForUnitTest.mockRepositories();

        parentRepository.find = jest.fn().mockReturnValue(entity);

        let result = await parentRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.deletedAt).toBeUndefined();

        let wantedDeletedAt = new Date();

        parentRepository.delete = jest.fn().mockImplementationOnce(() => { entity.deletedAt = wantedDeletedAt });

        const service = new DeleteParentService(parentRepository);

        expect(await service.execute(wantedId)).toBe(void 0);
        result = await parentRepository.find(wantedId);
        expect(result).toBeDefined()
        expect(result.deletedAt).toBeDefined();
        expect(result.deletedAt).toStrictEqual(wantedDeletedAt)
    });

    it('should throw an error while deleting a parent', async () => {
        let parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        parentRepository.delete = jest.fn()
            .mockImplementationOnce(() => { throw new QueryFailedError(null, null, new Error('failed')) });

        const service = new DeleteParentService(parentRepository);

        await expect(service.execute('123')).rejects.toThrow(QueryFailedError);
    });

});
