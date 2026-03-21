import { Repository } from "typeorm";
import { AcademicSemester } from "../../../../domain/academc-semester/academic.semester";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { AcademicSemesterRepository } from "../../../../infrastructure/repositories/academic-semester/academic-semester.repository";
import { FindAllAcademicSemesterService } from "./findAll.academic-semester.service";
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { mockSemester } from "../../../../../tests/mocks/domains/semester.mocks";
import { mockQuarter } from "../../../../../tests/mocks/domains/quarter.mocks";

describe('AcademicSemester integration tests', () => {

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRepository;

    beforeAll(async () => {
        semesterEntity = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(semesterEntity, TestDataSource);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('model and repository should be instantiated', async () => {
        expect(semesterEntity).toBeDefined();
        expect(semesterRepository).toBeDefined();
    })

    it('should receive an empty array', async () => {
        const service = new FindAllAcademicSemesterService(semesterRepository);
        let results = await service.execute();
        expect(results.all.length).toBe(0);
    });

    it('should receive two semester', async () => {
        const semester1 = mockSemester({ currentSemester: true });
        const entity1 = AcademicSemesterEntity.toEntity(semester1);
        expect(await semesterRepository.create(entity1)).toBeInstanceOf(AcademicSemesterEntity);
        const thirdQuarter = mockQuarter({
            currentQuarter: false,
            beginningDate: new Date(2026, 7, 1, 0, 0, 0),
            endingDate: new Date(2026, 8, 30, 23, 59, 59),
        });
        const forth = mockQuarter({
            currentQuarter: false,
            beginningDate: new Date(2026, 9, 1, 0, 0, 0),
            endingDate: new Date(2026, 10, 30, 23, 59, 59),
        });
        const semester2 = mockSemester({
            currentSemester: false,
            firstQuarter: thirdQuarter,
            secondQuarter: forth
        });
        const entity2 = AcademicSemesterEntity.toEntity(semester2);
        expect(await semesterRepository.create(entity2)).toBeInstanceOf(AcademicSemesterEntity);
        const service = new FindAllAcademicSemesterService(semesterRepository);
        const results = await service.execute();

        expect(results.all.length).toBe(2);
        expect(results.all[0].id).toEqual(entity1.id);
        expect(results.all[1].id).toEqual(entity2.id);
    });

});
