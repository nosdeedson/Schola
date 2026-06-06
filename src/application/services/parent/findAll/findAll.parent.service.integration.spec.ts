import { Repository } from 'typeorm';
import { ParentEntity } from '../../../../infrastructure/entities/parent/parent.entity';
import { ParentRepository } from '../../../../infrastructure/repositories/parent/parent.repository';
import { FindAllParentService } from './findAll.parent.service';
import { mockParent } from '../../../../../tests/mocks/domain/parent.mocks';
import { TestDataSource } from '@/infrastructure/repositories/config-test/test.datasource';


describe('FindAllParentService integration tests', () => {

    let parentEntity: Repository<ParentEntity>;
    let parentRepository: ParentRepository;

    beforeEach(async () => {
        parentEntity = TestDataSource.getRepository(ParentEntity);
        parentRepository = new ParentRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('entitites and repositories must be instantiated', async () => {
        expect(parentEntity).toBeDefined();
        expect(parentRepository).toBeDefined();
    });

    it('should find an empty array', async () => {
        const service = new FindAllParentService(parentRepository);
        const results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all.length).toBe(0);
    });

    it('should find an array with one parent', async () => {
        const parent = mockParent();
        const entity = ParentEntity.toParentEntity(parent);
        expect(await parentRepository.create(entity)).toBeInstanceOf(ParentEntity);
        const service = new FindAllParentService(parentRepository);
        const results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all.length).toBe(1);
        expect(results.all[0].id).toBe(parent.getId());
    });
});
