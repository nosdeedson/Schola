import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateClassService } from '../../../application/services/class/create/create.class.service';
import { CreateWorkerService } from '../../../application/services/worker/create/create.worker.service';
import { DeleteClassService } from '../../../application/services/class/delete/delete.class.service';
import { FindClassDto } from "../../../application/services/class/find/find.class.dto";
import { FindClassService } from '../../../application/services/class/find/find.class.service';
import { FindAllClassDto } from '../../../application/services/class/findAll/findAll.class.dto';
import { FindAllClassService } from '../../../application/services/class/findAll/findAll.class.service';
import { UpdateClassService } from '../../../application/services/class/update/update.class.service';
import { RepositoryFactoryService } from '../../../infrastructure/factory/repositiry-factory/repository-factory.service';
import { setEnv } from '../../../infrastructure/__mocks__/env.mock';
import { MockSchoolgroupDto } from '../../../infrastructure/__mocks__/mock-schoolgroup-dto';
import { DomainMocks } from '../../../infrastructure/__mocks__/mocks';
import { DataBaseConnectionModule } from '../../../infrastructure/data-base-connection/data-base-connection.module';
import { ClassEntity } from '../../../infrastructure/entities/class/class.entity';
import { SchoolgroupUseCases } from './schoolgroup-usecases';
import { WorkerEntity } from '../../../infrastructure/entities/worker/worker.entity';
import { RoleEnum } from '../../../domain/worker/roleEnum';


describe('SchoolgroupUsecaseService', () => {
  let service: SchoolgroupUseCases;
  let module: TestingModule
  let input: any;
  beforeEach(async () => {
    input = {
      classCode: undefined,
      nameBook: "book name",
      name: "teste",
      scheduleDto: {
        dayOfWeeks: [
          "Monday",
          "Tuesday",
        ],
        times: { 'Monday': '08:00', 'Tuesday': '09:00' },
      },
    };
    setEnv();
    module = await Test.createTestingModule({
      imports: [DataBaseConnectionModule],
      providers: [SchoolgroupUseCases, RepositoryFactoryService],
    }).compile();

    service = module.get<SchoolgroupUseCases>(SchoolgroupUseCases);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should find a schoolgroup', async () => {
      const id = "1";
      const classEntity = ClassEntity.toClassEntity(DomainMocks.mockSchoolGroup());
      const mockResult = FindClassDto.toDto(classEntity);
      const find = jest.spyOn(FindClassService.prototype, 'execute')
        .mockImplementationOnce(async () => await Promise.resolve(mockResult));

      const result = await service.find(id);
      expect(result).toEqual(mockResult);
      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith(id);
    });

    it('should throw an error', async () => {
      const id = "1";
      const find = jest.spyOn(FindClassService.prototype, 'execute')
        .mockRejectedValue(new BadRequestException("Test"));

      await expect( service.find(id)).rejects.toThrow();
      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith(id);
      
    });

  });

  describe('findAll', () => {
    it('should find all schoolgroups', async () => {
      const id = "1";
      const classEntity = ClassEntity.toClassEntity(DomainMocks.mockSchoolGroup());
      const classEntity1 = ClassEntity.toClassEntity(DomainMocks.mockSchoolGroup());
      const mockResults = new FindAllClassDto([classEntity, classEntity1]);
      const findAll = jest.spyOn(FindAllClassService.prototype, 'execute')
        .mockResolvedValue( mockResults);

      const result = await service.findAll();
      expect(result).toEqual(mockResults);
      expect(findAll).toHaveBeenCalledTimes(1);
      expect(result.all.length).toBe(2);
    });

    it('should fin anything', async () => {
      const mockResult = new FindAllClassDto([]);
      const findAll = jest.spyOn(FindAllClassService.prototype, 'execute')
        .mockResolvedValue(mockResult);

      const result = await service.findAll();
      expect(findAll).toHaveBeenCalledTimes(1);
      expect(result.all.length).toBe(0);
      expect(result).toEqual(mockResult);
    });

  });

  describe('delete', () => {
    it('should delete a schoolgroup', async () => {
      const id = "1";
      const deleteService = jest.spyOn(DeleteClassService.prototype, 'execute')
        .mockImplementationOnce( async () => await Promise.resolve(void 0));

      await service.delete(id);
      expect(deleteService).toHaveBeenCalledTimes(1);
      expect(deleteService).toHaveBeenCalledWith(id);
    });
  });

});
