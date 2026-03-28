import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";
import { MockRepositoriesForUnitTest } from "../../../../infrastructure/__mocks__/mockRepositories";
import { AcademicSemesterEntity } from "../../../../infrastructure/entities/academic-semester/academic.semester.entity";
import { FindAcademicSemesterService } from "../find/find.academic-semester.service"

describe('find academic semester unit test', () =>{

    afterEach( async () => {
        jest.clearAllMocks();
    })

    it('should find an academicSemester', async () =>{
        const semesterRepository = await MockRepositoriesForUnitTest.mockRepositories();
        const semester = mockSemester();
        const entity = AcademicSemesterEntity.toEntity(semester);
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