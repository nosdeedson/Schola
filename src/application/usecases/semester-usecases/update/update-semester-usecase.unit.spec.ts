import { NotFoundException } from "@nestjs/common";
import { mockUpdateSemesterDto } from "../../../../../tests/mocks/domain-dto/update-semester-dto.mocks";
import { ExceptionHandler } from "../../../../infrastructure/utils/exception-handler/exception-handler";
import { SystemError } from "../../../services/@shared/system-error";
import { UpdateAcademicSemesterService } from "../../../services/academic-semester/update/update.academic-semester.service";
import { UpdateSemesterUseCase } from "./update-semester.usecase";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";

describe('UpdateSemesterUserCase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('should udpate a semester', async () => {
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        const mockDto = mockUpdateSemesterDto();
        const updateService = jest.spyOn(UpdateAcademicSemesterService.prototype, 'execute')
            .mockImplementationOnce(() => Promise.resolve(void 0));
        const updateSemesterUsecase = new UpdateSemesterUseCase(repository);
        expect(await updateSemesterUsecase.execute(mockDto)).toBe(void 0);
        expect(updateService).toHaveBeenCalledWith(mockDto);
    });

    it('should throw an error while updating a semester', async () => {
        const repository = MockRepositoriesForUnitTest.mockRepositories();
        const mockDto = mockUpdateSemesterDto();
        const errorToThrow = new SystemError([{ context: 'semester', message: 'semester not found' }], 404);
        const updateService = jest.spyOn(UpdateAcademicSemesterService.prototype, 'execute')
            .mockRejectedValue(errorToThrow);

        const tratarError = jest.spyOn(ExceptionHandler, 'exceptionHandler')
            .mockImplementation(() => { throw new NotFoundException("semester not found") });
        const updateSemesterUsecase = new UpdateSemesterUseCase(repository);

        await expect(updateSemesterUsecase.execute(mockDto)).rejects
            .toMatchObject(new NotFoundException("semester not found"))
        expect(updateService).toHaveBeenCalledTimes(1);
        expect(tratarError).toHaveBeenCalled();
    });

});
