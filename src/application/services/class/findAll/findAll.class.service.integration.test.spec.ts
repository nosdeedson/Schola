import { DataSource } from "typeorm";
import { Repository } from "typeorm";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { ClassEntity } from "../../../../infrastructure/entities/class/class.entity";
import { ClassRepository } from '../../../../infrastructure/repositories/class/class.repository';
import { FindAllClassService } from './findAll.class.service';
import { AppDataSource } from "../../../../infrastructure/repositories/config-test/appDataSource";


describe('findall service integration test', () => {

    let appDataSource: DataSource;
    let classEntity: Repository<ClassEntity>;
    let classRepository: ClassRepository;

    beforeEach(async () => {
        appDataSource = AppDataSource.getAppDataSource();
        await appDataSource.initialize()
            .catch(error => console.log(error));

        classEntity = appDataSource.getRepository(ClassEntity);
        classRepository = new ClassRepository(appDataSource);
    });

    afterEach(async () => {
        await appDataSource.createQueryBuilder().delete().from(ClassEntity).execute();
        await appDataSource.destroy();
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
        let schoolgroup = DomainMocks.mockSchoolGroup();
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
