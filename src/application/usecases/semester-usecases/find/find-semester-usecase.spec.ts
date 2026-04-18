import { FindAcademicSemesterService } from "@/application/services/academic-semester/find/find.academic-semester.service";
import { MockRepositoriesForUnitTest } from "@/infrastructure/__mocks__/mockRepositories";
import { FindSemesterUsecase } from "./find-semester-usecase";
import { SystemError } from "@/application/services/@shared/system-error";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";
import { NotFoundException } from "@nestjs/common";
import { mockFindAcademicSemesterDto } from "../../../../../tests/mocks/usecases/find-academic-semester-dto.mock";

describe('FindSemesterUsecase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should handle an erro if semester does not exist', async () => {
        const notExist = '5f40d03e-4ebb-45a9-8078-e7931411628e';
        const findSemesterServive = jest.spyOn(FindAcademicSemesterService.prototype, 'execute')
            .mockImplementation(() => { throw new SystemError([{ context: 'academicSemester', message: 'Academic Semester not found' }]); });
        const tratarErros = jest.spyOn(TrataErros, 'tratarErrorsNotFound')
            .mockImplementation(() => { throw new NotFoundException('Academic Semester not found') });

        const repository = MockRepositoriesForUnitTest.mockRepositories();
        const usecase = new FindSemesterUsecase(repository);
        const result = await expect(usecase.execute(notExist)).rejects
            .toMatchObject(new NotFoundException('Academic Semester not found'));
        expect(result).toBeNull();
        expect(findSemesterServive).toHaveBeenCalledTimes(1);
        expect(findSemesterServive).toHaveBeenCalledWith(notExist);
        expect(tratarErros).toHaveBeenCalledTimes(1);
    });

    it('should find a semester', async () => {
        const semesterDto = mockFindAcademicSemesterDto();
        const wantedId = semesterDto.id;
        const findSemesterServive = jest.spyOn(FindAcademicSemesterService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(null));
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        const usecase = new FindAcademicSemesterService(repository);
        const result = await usecase.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toBe(wantedId)
        expect(findSemesterServive).toHaveBeenCalledTimes(1);
        expect(findSemesterServive).toHaveBeenCalledWith(wantedId);
    });
});
