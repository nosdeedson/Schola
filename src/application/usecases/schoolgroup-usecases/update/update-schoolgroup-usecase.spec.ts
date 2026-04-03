
import { Test, TestingModule } from '@nestjs/testing';
import { setEnv } from '../../../../infrastructure/__mocks__/env.mock';
import { DataBaseConnectionModule } from '../../../../infrastructure/data-base-connection/data-base-connection.module';
import { BadRequestException } from '@nestjs/common';
import { RepositoryFactoryService } from '../../../../infrastructure/factory/repositiry-factory/repository-factory.service';
import { UpdateClassService } from '../../../services/class/update/update.class.service';
import { WorkerEntity } from '../../../../infrastructure/entities/worker/worker.entity';
import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';
import { RoleEnum } from '../../../../domain/worker/roleEnum';
import { WorkerRepository } from '../../../../infrastructure/repositories/worker/worker.repository';
import { UpdateSchoolgroupUsecase } from "../../schoolgroup-usecases/update/update-schoolgroup-usecase";
import { UpdateSchoolgroupUsecaseDto } from './update-schoolgroup-usecase.dto';
import { mockUpdateSchoolgroupUsecaseDto } from '../../../../../tests/mocks/domain-dto/update-schoolgroup-usecase-dto.mocks';

describe('UpdateSchoolgroupUsecase', () => {

    let service: UpdateSchoolgroupUsecase;
    let module: TestingModule
    beforeAll(async () => {
        setEnv();
        module = await Test.createTestingModule({
            imports: [DataBaseConnectionModule],
            providers: [UpdateSchoolgroupUsecase, RepositoryFactoryService],
        }).compile();

        service = module.get<UpdateSchoolgroupUsecase>(UpdateSchoolgroupUsecase);
    });

    afterEach(async () => {
        jest.clearAllMocks();
        module.close();
    });

    it('should update a schoolgroup', async () => {
        const dto = mockUpdateSchoolgroupUsecaseDto();
        const teacher = WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER));
        const findTeacher = jest.spyOn(WorkerRepository.prototype, 'findByName')
            .mockImplementationOnce(async () => await Promise.resolve(teacher));
        const update = jest.spyOn(UpdateClassService.prototype, 'execute')
            .mockImplementationOnce(async () => await Promise.resolve(void 0));
        const input = dto.toInput(teacher);
        expect(await service.update(dto)).toBe(void 0);
        expect(update).toHaveBeenCalledTimes(1);
        expect(update).toHaveBeenCalledWith(input);
        expect(findTeacher).toHaveBeenCalledTimes(1);
    });

    it('should throw an error', async () => {
        const id = "1";
        const dto = new UpdateSchoolgroupUsecaseDto();
        dto.id = id;
        dto.nameBook = "bookName";
        dto.teacherName = "new teacher";
        const update = jest.spyOn(UpdateClassService.prototype, 'execute')
            .mockRejectedValue(new BadRequestException("Test"));
        const findTeacher = jest.spyOn(WorkerRepository.prototype, 'findByName')
            .mockImplementationOnce(async () => await Promise.resolve(null as any));

        const input = dto.toInput(WorkerEntity.toWorkerEntity(DomainMocks.mockWorker(RoleEnum.TEACHER)));
        await expect(service.update(dto)).rejects.toThrow();
        expect(update).toHaveBeenCalledTimes(0);
        expect(findTeacher).toHaveBeenCalledWith(dto.teacherName);
        expect(findTeacher).toHaveBeenCalledTimes(1);
    });

});