import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { FindSchoolgroupUsecase } from "./find-schoolgroup-usecase";
import { FindClassDto } from "@/application/services/class/find/find.class.dto";
import { SystemError } from "@/application/services/@shared/system-error";
import { ExceptionHandler } from "@/infrastructure/utils/exception-handler/exception-handler";
import { NotFoundException } from "@nestjs/common";
import { FindClassService } from "@/application/services/class/find/find.class.service";

describe('FindSchoolgroupUsecase', () => {

    it('should find a class', async () => {
        const schoolgroup = mockClass();
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.find = jest.fn()
            .mockImplementation(() => Promise.resolve(schoolgroup));
        const usecase = new FindSchoolgroupUsecase(classRepository);
        const result = await usecase.execute(schoolgroup.getId());
        expect(result).toBeInstanceOf(FindClassDto);
        expect(result.id).toBe(schoolgroup.getId());
        expect(result.classCode).toBe(schoolgroup.getClassCode());
    });

    it('should throw an error if class not found', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const findClassService = jest.spyOn(FindClassService.prototype, 'execute')
            .mockImplementation(() => { throw new SystemError([{ context: 'class', message: 'class not found' }], 404) });
        const tratarError = jest.spyOn(ExceptionHandler, 'exceptionHandler')
            .mockImplementationOnce(() => { throw new NotFoundException('class not found') });
        const usecase = new FindSchoolgroupUsecase(classRepository);
        await expect(usecase.execute("123")).rejects.toMatchObject(new NotFoundException('class not found'));
        expect(tratarError).toHaveBeenCalledTimes(1);
        expect(findClassService).toHaveBeenCalledTimes(1);
    });
});
