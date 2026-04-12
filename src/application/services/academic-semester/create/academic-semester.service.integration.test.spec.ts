import { AcademicSemesterRespositoryInterface } from "../../../../domain/academc-semester/academic.semester.repository.interface";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { AcademicSemesterRepository } from '../../../../infrastructure/repositories/academic-semester/academic-semester.repository';
import { CreateAcademicSemesterUsecaseDto } from "./semester/create-academic-semester-usecase.dto";
import { CreateAcademicSemesterService } from './create.academic-semester.service';
import { TestDataSource } from "../../../../infrastructure/repositories/config-test/test.datasource";
import { Repository } from "typeorm";
import { mockQuarterDto } from "../../../../../tests/mocks/domain-dto/quarter-dto.mocks";

describe('Academic semester integration test', () => {

    let semesterEntity: Repository<AcademicSemesterEntity>;
    let semesterRepository: AcademicSemesterRespositoryInterface;

    beforeAll(async () => {
        semesterEntity = TestDataSource.getRepository(AcademicSemesterEntity);
        semesterRepository = new AcademicSemesterRepository(semesterEntity, TestDataSource);
    });

    it('repository must be instantiated', async () => {
        expect(semesterRepository).toBeDefined();
    })

    it('should save a academicSemester in BD', async () => {
        const firstQuarterDto = mockQuarterDto({ currentQuarter: true });
        const secondQuarterDto = mockQuarterDto({
            currentQuarter: false,
            beginningDate: new Date(2026, 3, 1),
            endingDate: new Date(2026, 5, 3),
        });
        const createSemesterDto = new CreateAcademicSemesterUsecaseDto({
            firstQuarter: firstQuarterDto,
            secondQuarter: secondQuarterDto,
            currentSemester: true
        })
        let service = new CreateAcademicSemesterService(semesterRepository);
        expect(await service.execute(createSemesterDto)).toBe(void 0);

        let results = await semesterRepository.findAll();
        expect(results).toBeDefined();
        expect(results[0].quarters[0].beginningDate.getTime()).toEqual(firstQuarterDto.beginningDate.getTime());
        expect(results[0].quarters[0].endingDate.getTime()).toEqual(firstQuarterDto.endingDate.getTime());
        expect(results[0].quarters[0].currentQuarter).toBeTruthy();
        expect(results[0].quarters[1].beginningDate.getTime()).toEqual(secondQuarterDto.beginningDate.getTime());
        expect(results[0].quarters[1].endingDate.getTime()).toEqual(secondQuarterDto.endingDate.getTime());
        expect(results[0].quarters[1].currentQuarter).toBeFalsy();
        expect(results[0].current).toBeTruthy();
        expect(results[0].id).toBeDefined();
    });

    it('shoud throw an erro if quarters are the same', async () => {
        const firstQuarterDto = mockQuarterDto();
        const secondQuarterDto = mockQuarterDto();
        const createSemesterDto = new CreateAcademicSemesterUsecaseDto({
            firstQuarter: firstQuarterDto,
            secondQuarter: secondQuarterDto,
            currentSemester: true
        })
        const service = new CreateAcademicSemesterService(semesterRepository);
        await expect(service.execute(createSemesterDto)).rejects.toMatchObject({
            errors: [
                {
                    "context": "academicSemester",
                    "message": "the end of the first Quarter must be before the start of the beggining of the secondQuarter",
                },
            ]
        });
        let results = await semesterRepository.findAll();
        expect(results).toHaveLength(0);
    });
});
