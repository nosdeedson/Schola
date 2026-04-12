import { MockRepositoriesForUnitTest } from "@/infrastructure/__mocks__/mockRepositories";
import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { mockClass } from "../../../../../tests/mocks/domain/class.mocks";
import { FindSchoolgroupUsecase } from "./find-schoolgroup-usecase";
import { FindClassDto } from "@/application/services/class/find/find.class.dto";
import { SystemError } from "@/application/services/@shared/system-error";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";
import { NotFoundException } from "@nestjs/common";
import { FindClassService } from "@/application/services/class/find/find.class.service";

describe('FindSchoolgroupUsecase', () => {

    it('should find a class', async () => {
        const entity = ClassEntity.toClassEntity(mockClass());
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        classRepository.find = jest.fn()
            .mockImplementation(() => Promise.resolve(entity));
        const usecase = new FindSchoolgroupUsecase(classRepository);
        const result = await usecase.execute(entity.id);
        expect(result).toBeInstanceOf(FindClassDto);
        expect(result.id).toBe(entity.id);
        expect(result.classCode).toBe(entity.classCode);
    });

    it('should throw an error if class not found', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const findClassService = jest.spyOn(FindClassService.prototype, 'execute')
            .mockImplementation(() => { throw new SystemError([{ context: 'class', message: 'class not found' }]) });
        const tratarError = jest.spyOn(TrataErros, 'tratarErrorsNotFound')
            .mockImplementationOnce(() => { throw new NotFoundException('class not found') });
        const usecase = new FindSchoolgroupUsecase(classRepository);
        await expect(usecase.execute("123")).rejects.toMatchObject(new NotFoundException('class not found'));
        expect(tratarError).toHaveBeenCalledTimes(1);
        expect(findClassService).toHaveBeenCalledTimes(1);
    });
})
