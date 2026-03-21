import { Test, TestingModule } from '@nestjs/testing';
import { SemesterUsecases } from './semester-usecases';
import { DataBaseConnectionModule } from '../../../infrastructure/data-base-connection/data-base-connection.module';
import { setEnv } from '../../../infrastructure/__mocks__/env.mock';
import { CreateAcademicSemesterService } from '../../../application/services/academic-semester/create/create.academic-semester.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindAcademicSemesterService } from '../../../application/services/academic-semester/find/find.academic-semester.service';
import { FindAcademicSemesterDto } from '../../../application/services/academic-semester/find/find.academic-semester.dto';
import { FindAllAcademicSemesterService } from '../../../application/services/academic-semester/findAll/findAll.academic-semester.service';
import { FindAllAcademicSemesterDto } from '../../../application/services/academic-semester/findAll/findAll.academic-semester.dto';
import { AcademicSemesterEntity } from '../../../infrastructure/entities/academic-semester/academic.semester.entity';
import { DomainMocks } from '../../../infrastructure/__mocks__/mocks';
import { DeleteAcademicSemesterService } from '../../../application/services/academic-semester/delete/delete.academic-semester.service';
import { UpdateAcademicSemesterService } from '../../../application/services/academic-semester/update/update.academic-semester.service';
import { RepositoryFactoryService } from "../../../infrastructure/factory/repositiry-factory/repository-factory.service";
import { mockCreateSemesterDto } from '../../../../tests/mocks/dto/create-semester-dto.mocks';


describe('SemesterUsecases', () => {
  let service: SemesterUsecases;
  let module: TestingModule;

  beforeEach(async () => {
    setEnv();
    module = await Test.createTestingModule({
      imports: [DataBaseConnectionModule],
      providers: [
        SemesterUsecases,
        RepositoryFactoryService
      ],
    }).compile();

    service = module.get<SemesterUsecases>(SemesterUsecases);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should find a semester by id', async () => {
      const id = 'test-id';
      const mockResult = new FindAcademicSemesterDto(id, true, new Date(), new Date());
      const executeSpy = jest.spyOn(FindAcademicSemesterService.prototype, 'execute')
        .mockResolvedValue(mockResult);

      const result = await service.find(id);

      expect(executeSpy).toHaveBeenCalledWith(id);
      expect(result).toBe(mockResult);
    });

    it('should handle errors', async () => {
      const id = 'test-id';
      jest.spyOn(FindAcademicSemesterService.prototype, 'execute')
        .mockRejectedValue(new BadRequestException('Test error'));

      await expect(service.find(id)).rejects.toThrow();
    });

  });

  describe('findAll', () => {
    it('should find all semesters', async () => {
      const mockResult1 = AcademicSemesterEntity.toAcademicSemester(DomainMocks.mockAcademicSemester());
      const mockResult2 = AcademicSemesterEntity.toAcademicSemester(DomainMocks.mockAcademicSemester());
      const mockResults = new FindAllAcademicSemesterDto([mockResult1, mockResult2]);
      const executeSpy = jest.spyOn(FindAllAcademicSemesterService.prototype, 'execute')
        .mockResolvedValue(mockResults);

      const result = await service.findAll();

      expect(executeSpy).toHaveBeenCalled();
      expect(result).toBe(mockResults);
      expect(result.all.length).toBe(2);
    });

    it('should find any semesters', async () => {
      const mockResults = new FindAllAcademicSemesterDto([]);
      const executeSpy = jest.spyOn(FindAllAcademicSemesterService.prototype, 'execute')
        .mockResolvedValue(mockResults);

      const result = await service.findAll();

      expect(executeSpy).toHaveBeenCalled();
      expect(result).toBe(mockResults);
      expect(result.all.length).toBe(0);
    });

  });

  describe('delete', () => {
    it('should delete a semester', async () => {
      const id = 'test-id';
      const executeSpy = jest.spyOn(DeleteAcademicSemesterService.prototype, 'execute')
        .mockResolvedValue(void 0);

      await service.delete(id);

      expect(executeSpy).toHaveBeenCalledWith(id);
    });

    it('should handle errors', async () => {
      const id = 'test-id';
      jest.spyOn(DeleteAcademicSemesterService.prototype, 'execute')
        .mockRejectedValue(new NotFoundException('Test error'));

      await expect(service.delete(id)).rejects.toThrow();
    });

  });

  describe('update', () => {
    it('should update a semester', async () => {
      const id = 'test-id';
      const actual = true;
      const executeSpy = jest.spyOn(UpdateAcademicSemesterService.prototype, 'execute')
        .mockResolvedValue(void 0);

      await service.update(id, actual);

      expect(executeSpy).toHaveBeenCalledWith(expect.objectContaining({ id, actual }));
    });
  });

});
