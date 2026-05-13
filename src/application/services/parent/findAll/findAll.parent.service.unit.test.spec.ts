import { FindAllParentService} from './findAll.parent.service';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';
import { ParentEntity } from '../../../../infrastructure/entities/parent/parent.entity';


describe('FindAllParentService unit tests', () =>{

    it('should return empty array', async () =>{
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        parentRepository.findAll = jest.fn().mockImplementationOnce(() => {
            return []
        });
        const service = new FindAllParentService(parentRepository);
        const results = await service.execute()
        expect(results).toBeDefined();
        expect(results.all.length).toBe(0)
    })

    it('should return all parent', async () =>{
        const parentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const parent = DomainMocks.mockParent();
        const entity = ParentEntity.toParentEntity(parent);
        parentRepository.findAll = jest.fn().mockImplementationOnce(() => {
            return [entity]
        });
        const service = new FindAllParentService(parentRepository);
        const results = await service.execute()
        expect(results).toBeDefined();
        expect(results.all.length).toBe(1);
        expect(results.all[0].id).toBe(parent.getId())
    })
})