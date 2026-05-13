import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';
import { UpdateParentService } from './update.parent.service';
import { StudentEntity } from '../../../../infrastructure/entities/student/student.entity';
import { ParentEntity } from '../../../../infrastructure/entities/parent/parent.entity';

describe('UpdateParentService unit test', () => {

    it('given wrong id should throw an systemError', async () => {
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        parentRepository.find = jest.fn().mockImplementationOnce(() => null);
        const service = new UpdateParentService(parentRepository);
        const noExistentParentId = 'ce8750b9-6396-4d87-86f1-caa3316ff177'
        await expect(service.execute(new Date(), "does not matter", noExistentParentId))
            .rejects.toMatchObject({
                errors: [{
                    context: 'parent', message: 'Parent not found'
                }]
            });
    });

    it('should update the parent', async () => {
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const parent = DomainMocks.mockParent();
        const parentEntity = ParentEntity.toParentEntity(parent);
        parentRepository.find = jest.fn().mockImplementationOnce(() => parentEntity);
        const wantedName = 'Marcus';
        const wantedBirthday = new Date();
        const service = new UpdateParentService(parentRepository);
        const parentId = parent.getId()
        expect(await service.execute(wantedBirthday, wantedName, parentId)).toBe(void 0);
    });
});