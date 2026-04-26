import { DateHelper } from '../../../../helpers/date/date.helper';
import { ClassEntity } from '../../../../infrastructure/entities/class/class.entity';
import { ClassRepository } from '../../../../infrastructure/repositories/class/class.repository';
import { ScheduleDto } from './schedule-dto';
import { CreateClassService } from './create.class.service';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { TestDataSource } from '../../../../infrastructure/repositories/config-test/test.datasource';
import { CreateClassDto } from './create.class.dto';

describe('create class service integration test', () => {

    let appDatasource: DataSource;
    let classEntity: Repository<ClassEntity>;
    let classRepository: ClassRepository;

    let aValidDate1 = new Date(2024, 7, 9, 17, 5, 0, 0);
    let aValidDate2 = new Date(2024, 7, 8, 17, 5, 0, 0);
    let dayOfWeek1;
    let dayOfWeek2;
    let times = new Map<string, string>();
    let scheduleDto: ScheduleDto;

    beforeAll(async () => {
        classEntity = TestDataSource.getRepository(ClassEntity);
        classRepository = new ClassRepository(TestDataSource);
        dayOfWeek1 = DateHelper.getDayOfweek(aValidDate1);
        dayOfWeek2 = DateHelper.getDayOfweek(aValidDate2);
        DateHelper.setTime(times, dayOfWeek1, '08:00');
        DateHelper.setTime(times, dayOfWeek2, '08:00');
        scheduleDto = new ScheduleDto([dayOfWeek1, dayOfWeek2], times);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('repository and entity should be instantiated', () => {
        expect(classEntity).toBeDefined();
        expect(classRepository).toBeDefined();
    });

    it('should create a class on BD', async () => {
        let classDto = new CreateClassDto('a1', 'a1class1', scheduleDto);
        let service = new CreateClassService(classRepository);
        expect(await service.execute(classDto)).toBe(void 0);
        let results = await classRepository.findAll();
        expect(results).toBeDefined();
        expect(results[0].id).toBeDefined();
        expect(results.length).toBe(1)
    });
})
