import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { FindAcademicSemesterService } from "./find.academic-semester.service"

describe('find academic semester unit test', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('should find an academicSemester', async () => {
        const semesterRepository = await MockRepositoriesForUnitTest.mockRepositories();
        const semester = mockSemester();
        const entity = AcademicSemesterMapper.fromDomain(semester);
        semesterRepository.find = jest.fn().mockImplementationOnce(() => {
            return entity;
        });
        let wantedId = semester.getId();
        const service = new FindAcademicSemesterService(semesterRepository);
        let result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toBe(wantedId);
        expect(result.firstQuarter.beginningDate.getTime()).toBe(semester.firstQuarter.beginningDate.getTime());
        expect(result.firstQuarter.endingDate.getTime()).toBe(semester.firstQuarter.endingDate.getTime());
        expect(semesterRepository.find).toHaveBeenCalledTimes(1)
        expect(semesterRepository.find).toHaveBeenCalledWith(wantedId)
    });
});
