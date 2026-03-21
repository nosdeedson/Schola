import { Repository } from "typeorm";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { AcademicSemesterRepository } from '../../../../infrastructure/repositories/academic-semester/academic-semester.repository';
import { UpdateAcademicSemesterDto } from "./udpate.academic-semester.dto";
import { UpdateAcademicSemesterService } from "./update.academic-semester.service";
import { TestDataSource } from '../../../../infrastructure/repositories/config-test/test.datasource';
import { mockSemester } from "../../../../../tests/mocks/domains/semester.mocks";


describe('Update AcademicSemester integration tests', () =>{

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    beforeAll(async () =>{
        semesterEntity = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(semesterEntity, TestDataSource);
    })

    afterEach(async () =>{
        jest.clearAllMocks();
    });

    it('repository and model should be instantiated', async () =>{
        expect(semesterEntity).toBeDefined();
        expect(semesterRepository).toBeDefined();
    });

    it('should update the second an academicSemester', async () => {
        const entity = AcademicSemesterEntity.toEntity(mockSemester({ currentSemester: true }));
        let wantedId = entity.id;
        expect(await semesterRepository.create(entity)).toBeInstanceOf(AcademicSemesterEntity);
        const dto = new UpdateAcademicSemesterDto({
            id: entity.id,
            updatingQuarter: true,
            updatingSemester: false,
        });

        const service = new UpdateAcademicSemesterService(semesterRepository);
        expect(await service.execute(dto)).toBe(void 0);
        let result = await semesterRepository.find(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toBe(wantedId);
        expect(result.current).toBeTruthy();
        expect(result.quarters[0].currentQuarter).toBeFalsy();
        expect(result.quarters[1].currentQuarter).toBeTruthy();
    });

    it('should update the semester as not current', async () => {
        const entity = AcademicSemesterEntity.toEntity(mockSemester({ currentSemester: true }));
        let wantedId = entity.id;
        expect(await semesterRepository.create(entity)).toBeInstanceOf(AcademicSemesterEntity);
        const dto = new UpdateAcademicSemesterDto({
            id: entity.id,
            updatingQuarter: false,
            updatingSemester: true,
        });

        const service = new UpdateAcademicSemesterService(semesterRepository);
        expect(await service.execute(dto)).toBe(void 0);
        let result = await semesterRepository.find(wantedId);
        // as deleted_at is not null by default Typeorm does not find the semester eventhough is in database
        expect(result).toBeNull();
    });

});
