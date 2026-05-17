import { DataSource } from "typeorm";
import { Repository } from "typeorm";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { ClassRepository } from '../../../../infrastructure/repositories/class/class.repository';
import { FindAllClassService } from './findAll.class.service';
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { TestDataSource } from "@/infrastructure/repositories/config-test/test.datasource";


describe('findall service integration test', () => {

    let classEntity: Repository<ClassEntity>;
    let classRepository: ClassRepository;

    beforeEach(async () => {
        classEntity = TestDataSource.getRepository(ClassEntity);
        classRepository = new ClassRepository(TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('repository and entity must be instantiated', async () => {
        expect(classEntity).toBeDefined();
        expect(classRepository).toBeDefined();
    });

    it('should not find any class ', async () => {
        const service = new FindAllClassService(classRepository);
        let results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all).toBeDefined();
        expect(results.all.length).toBe(0);

    });


    it('should find one class', async () => {
        let schoolgroup = mockClass();
        let entity = ClassEntity.toClassEntity(schoolgroup);
        expect(await classRepository.create(entity)).toBeInstanceOf(ClassEntity);

        const service = new FindAllClassService(classRepository);
        let results = await service.execute();

        expect(results).toBeDefined();
        expect(results.all).toBeDefined();
        expect(results.all[0].id).toEqual(schoolgroup.getId());
        expect(results.all.length).toBe(1)
    });

})
