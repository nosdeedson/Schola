import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';
import { ClassEntity } from '../../../../infrastructure/entities/class/class.entity';
import { ClassRepository } from '../../../../infrastructure/repositories/class/class.repository';
import { FindClassService } from './find.class.service';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { ClassRepositoryInterface } from '../../../../domain/class/class.repository.interface';
import { Class } from '../../../../domain/class/class';
import { AppDataSource } from '../../../../infrastructure/repositories/config-test/appDataSource';


describe('find class service integration test', () => {

    let appDataSource: DataSource;
    let classEntity: Repository<ClassEntity>;
    let classRepository: ClassRepositoryInterface | ClassRepository;

    let schoolgroup: Class;

    beforeEach(async () => {
        schoolgroup = DomainMocks.mockSchoolGroup();
        appDataSource = AppDataSource.getAppDataSource();
        await appDataSource.initialize()
            .catch((error: any) => console.log(error))
        classEntity = appDataSource.getRepository(ClassEntity);
        classRepository = new ClassRepository(appDataSource);
    });

    afterEach(async () => {
        await appDataSource.createQueryBuilder().delete().from(ClassEntity).execute();
        await appDataSource.destroy();
        jest.clearAllMocks();
    });

    it('should not find a class on BD with wrong id', async () => {
        schoolgroup = DomainMocks.mockSchoolGroup();
        let entity = ClassEntity.toClassEntity(schoolgroup);
        expect(await classRepository.create(entity)).toBeInstanceOf(ClassEntity);
        const service = new FindClassService(classRepository);

        let wantedId = '95be3d59-a09c-4da5-9140-0c805c5a391d';
        try {
            let result = await service.execute(wantedId);
        } catch (error) {
            //@ts-ignore
            expect(error.errors).toBeDefined();
            //@ts-ignore
            expect(error.errors[0]).toStrictEqual({ context: 'class', message: 'class not found' })
        }
    });

    it('repository and entity must be instantiated', async () => {
        expect(classEntity).toBeDefined();
        expect(classRepository).toBeDefined();
    })

    it('should find a class on BD', async () => {
        schoolgroup = DomainMocks.mockSchoolGroup();
        let entity = ClassEntity.toClassEntity(schoolgroup);
        expect(await classRepository.create(entity)).toBeInstanceOf(ClassEntity);
        const service = new FindClassService(classRepository);

        let wantedId = schoolgroup.getId();
        let result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(wantedId);

    });

})
