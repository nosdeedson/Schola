import { MockRepositoriesForUnitTest } from "../../../../infrastructure/__mocks__/mockRepositories";
import { CreateAcademicSemesterDto } from './semester/academic-semester.dto';
import { CreateAcademicSemesterService } from './create.academic-semester.service';
import { mockQuarterDto } from "../../../../../tests/mocks/dto/quarter-dto.mocks";

describe('Academic semester service unit test', () => {

    it('should create a semester', async () => {
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new CreateAcademicSemesterService(semesterRepository);

        const firstQuarterDto = mockQuarterDto({ currentQuarter: true });
        const secondQuarterDto = mockQuarterDto({
            currentQuarter: false,
            beginningDate: new Date(2026, 3, 1),
            endingDate: new Date(2026, 5, 3),
        });
        const createSemesterDto = new CreateAcademicSemesterDto({
            firstQuarter: firstQuarterDto,
            secondQuarter: secondQuarterDto,
            currentSemester: true
        });
        expect(await service.execute(createSemesterDto)).toBe(void 0);
        expect(semesterRepository.create).toHaveBeenCalled();
        expect(semesterRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when firstQuarter and secondQuarter are the samse', async () => {
        const firstQuarterDto = mockQuarterDto();
        const secondQuarterDto = mockQuarterDto();
        const createSemesterDto = new CreateAcademicSemesterDto({
            firstQuarter: firstQuarterDto,
            secondQuarter: secondQuarterDto,
            currentSemester: true
        })
        const semesterRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new CreateAcademicSemesterService(semesterRepository);
        await expect( service.execute(createSemesterDto)).rejects.toMatchObject({
            errors: [
                {
                    "context": "academicSemester",
                    "message": "the end of the first Quarter must be before the start of the beggining of the secondQuarter",
                },
            ]
        });
        expect(semesterRepository.create).toHaveBeenCalledTimes(0);
    });

})