import { FindAllAcademicSemesterDto } from "@/application/services/academic-semester/findAll/findAll.academic-semester.dto";
import { FindAllAcademicSemesterService } from "@/application/services/academic-semester/findAll/findAll.academic-semester.service";
import { MockRepositoriesForUnitTest } from "@/infrastructure/__mocks__/mockRepositories";
import { FindAllSemesterUsecase } from "./find-all-semester-usecase";
import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { mockSemester } from "../../../../../tests/mocks/domain/semester.mocks";

describe('FindAllSemesterUsecase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('should find an empty array', async () => {
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        repository.findAll = jest.fn().mockImplementation(() => Promise.resolve([]))
        const findAllSemesterService = jest.spyOn(FindAllAcademicSemesterService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(new FindAllAcademicSemesterDto([])));
        const usecase = new FindAllSemesterUsecase(repository);
        const result = await usecase.execute();
        expect(result).toBeDefined();
        expect(result.all).toHaveLength(0);
        expect(findAllSemesterService).toHaveBeenCalledTimes(1);
    });

    it('should find all semester', async () => {
        const semester = AcademicSemesterEntity.toEntity(mockSemester());
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        repository.findAll = jest.fn().mockImplementation(() => Promise.resolve([semester]));
        const findSemesterService = jest.spyOn(FindAllAcademicSemesterService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(new FindAllAcademicSemesterDto([semester])));
        const usecase = new FindAllSemesterUsecase(repository);
        const result = await usecase.execute();
        expect(result).toBeDefined();
        expect(result.all).toHaveLength(1);
        expect(result.all[0].id).toBe(semester.id);
        expect(findSemesterService).toHaveBeenCalledTimes(1);
    });
});
