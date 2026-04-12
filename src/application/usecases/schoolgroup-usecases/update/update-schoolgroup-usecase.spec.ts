
import { Test, TestingModule } from '@nestjs/testing';
import { setEnv } from '../../../../infrastructure/__mocks__/env.mock';
import { DataBaseConnectionModule } from '../../../../infrastructure/data-base-connection/data-base-connection.module';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RepositoryFactoryService } from '../../../../infrastructure/factory/repositiry-factory/repository-factory.service';
import { UpdateClassService } from '../../../services/class/update/update.class.service';
import { WorkerEntity } from '../../../../infrastructure/entities/worker/worker.entity';
import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';
import { RoleEnum } from '../../../../domain/worker/roleEnum';
import { WorkerRepository } from '../../../../infrastructure/repositories/worker/worker.repository';
import { UpdateSchoolgroupUsecase } from "../../schoolgroup-usecases/update/update-schoolgroup-usecase";
import { UpdateSchoolgroupUsecaseDto } from './update-schoolgroup-usecase.dto';
import { mockUpdateSchoolgroupUsecaseDto } from '../../../../../tests/mocks/domain-dto/update-schoolgroup-usecase-dto.mocks';
import { MockRepositoriesForUnitTest } from '@/infrastructure/__mocks__/mockRepositories';
import { TrataErros } from '@/infrastructure/utils/trata-erros/trata-erros';

describe('UpdateSchoolgroupUsecase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('should update a schoolgroup', async () => {
        const teacher = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER));

        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.findByName = jest.fn()
            .mockImplementation(() => Promise.resolve(teacher));
        const dto = mockUpdateSchoolgroupUsecaseDto();

        const update = jest.spyOn(UpdateClassService.prototype, 'execute')
            .mockImplementationOnce(async () => await Promise.resolve(void 0));

        const input = dto.toInput(teacher);
        const usecase = new UpdateSchoolgroupUsecase(classRepository, workerRepository);
        expect(await usecase.update(dto)).toBe(void 0);
        expect(update).toHaveBeenCalledTimes(1);
        expect(update).toHaveBeenCalledWith(input);
    });

    it('should throw an error', async () => {
        const classRepository = MockRepositoriesForUnitTest.mockRepositories();
        const workerRepository = MockRepositoriesForUnitTest.mockRepositories();
        workerRepository.findByName = jest.fn().mockImplementation(() => null)
        const id = "1";
        const dto = new UpdateSchoolgroupUsecaseDto({
            id: id,
            nameBook: "bookName",
            teacherName: "new teacher"
        });
        const tratarErros = jest.spyOn(TrataErros, 'tratarErrorsNotFound')
            .mockImplementation(() => { throw new NotFoundException("teacher not found") })

        const usecase = new UpdateSchoolgroupUsecase(classRepository, workerRepository);
        await expect(usecase.update(dto)).rejects.toMatchObject(new NotFoundException("teacher not found"))
        // expect(tratarErros).toHaveBeenCalledTimes(1);
        expect(workerRepository.findByName).toHaveBeenCalledTimes(1);
        expect(workerRepository.findByName).toHaveBeenCalledWith(dto.teacherName);
    });

});
