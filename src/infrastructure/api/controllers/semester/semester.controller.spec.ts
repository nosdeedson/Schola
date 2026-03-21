import { Test, TestingModule } from '@nestjs/testing';
import { SemesterController } from './semester.controller';
import { SemesterUsecases } from '../../../../application/usecases/semester-usecases/semester-usecases';
import { CreateSemesterUsecase } from '../../../../application/usecases/semester-usecases/create/create-semester-usecase';
import { DataBaseConnectionModule } from '../../../data-base-connection/data-base-connection.module';
import { setEnv } from '../../../__mocks__/env.mock';
import { MockSemesterDto } from '../../../__mocks__/mock-semester-dto';
import { DomainMocks } from "../../../__mocks__/mocks";
import { AcademicSemesterEntity } from "../../../entities/academic-semester/academic.semester.entity";
import { BadRequestException } from '@nestjs/common';
import { RepositoryFactoryService } from '../../../../infrastructure/factory/repositiry-factory/repository-factory.service';
import { FindAcademicSemesterDto } from '../../../../application/services/academic-semester/find/find.academic-semester.dto';
import { FindAllAcademicSemesterDto } from '../../../../application/services/academic-semester/findAll/findAll.academic-semester.dto';
import { mockCreateSemesterDto } from '../../../../../tests/mocks/dto/create-semester-dto.mocks';

describe('SemesterController', () => {
  let controller: SemesterController;
  let module: TestingModule;

  beforeEach(async () => {
    setEnv();
    module = await Test.createTestingModule({
      controllers: [SemesterController],
      providers: [
        SemesterUsecases,
        CreateSemesterUsecase,
        RepositoryFactoryService,
      ],
      imports: [DataBaseConnectionModule]
    }).compile();

    controller = module.get<SemesterController>(SemesterController);
  });

  afterEach( async () => {
    jest.clearAllMocks();
    module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  }, 5000);

  it('should create a semester', async () => {
    let dto = mockCreateSemesterDto();
    const useCase = jest.spyOn(CreateSemesterUsecase.prototype, 'create')
     .mockImplementation(() => Promise.resolve());
    expect(await controller.create(dto)).toBe(void 0);
    expect(useCase).toHaveBeenCalledTimes(1);
    expect(useCase).toHaveBeenCalledWith(dto);
  });

  it('should throw an error', async () => {
    let dto = MockSemesterDto.dtoToCreate();
    const useCase = jest.spyOn(CreateSemesterUsecase.prototype, 'create')
     .mockImplementationOnce(() => Promise.reject(new BadRequestException('test')));
      try {
        await controller.create(dto)
      } catch (error) {
        expect(error).toBeDefined();
        expect(useCase).toHaveBeenCalledTimes(1);
        expect(useCase).toHaveBeenCalledWith(dto);
      }
  });

  it('should delete a semester', async () => {
    let id = 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6';
    const useCase = jest.spyOn(SemesterUsecases.prototype, 'delete')
     .mockImplementation(() => Promise.resolve());
    expect(await controller.delete(id)).toBe(void 0);
    expect(useCase).toHaveBeenCalledTimes(1);
    expect(useCase).toHaveBeenCalledWith(id);
  });

  it('should find a semester', async () => {
    // let id = 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6';
    // const mockResult = new FindAcademicSemesterDto(id, true, new Date(), new Date());
    // mockResult.id = id;
    // const useCase = jest.spyOn(SemesterUsecases.prototype, 'find')
    //  .mockImplementation(async () => await Promise.resolve(mockResult));
    // const result = await controller.find(id);
    // expect(result).toBe(mockResult);
    // expect(useCase).toHaveBeenCalledTimes(1);
    // expect(useCase).toHaveBeenCalledWith(id);
  });

  it('should find all semester', async () => {
    // const semester = AcademicSemesterEntity.toAcademicSemester(DomainMocks.mockAcademicSemester());
    // const semester1 = AcademicSemesterEntity.toAcademicSemester(DomainMocks.mockAcademicSemester());
    // const entities : AcademicSemesterEntity[] = [semester, semester1];
    // const mockResult = new FindAllAcademicSemesterDto(entities);
    // const useCase = jest.spyOn(SemesterUsecases.prototype, 'findAll')
    //  .mockImplementation(async () => await Promise.resolve(mockResult));
    // const result = await controller.findAll();
    // expect(result).toBe(mockResult);
    // expect(useCase).toHaveBeenCalledTimes(1);
    // expect(result.all).toHaveLength(2);
  });

  it('should not find any semester', async () => {
    const entities : AcademicSemesterEntity[] = [];
    const mockResult = new FindAllAcademicSemesterDto(entities);
    const useCase = jest.spyOn(SemesterUsecases.prototype, 'findAll')
     .mockImplementation(async () => await Promise.resolve(mockResult));
    const result = await controller.findAll();
    expect(result).toEqual(mockResult);
    expect(useCase).toHaveBeenCalledTimes(1);
  });

  it('should update a semester', async () => {
    let id = 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6';
    const useCase = jest.spyOn(SemesterUsecases.prototype, 'update')
     .mockImplementation(() => Promise.resolve());
    expect(await controller.update(id, true)).toBe(void 0);
    expect(useCase).toHaveBeenCalledTimes(1);
    expect(useCase).toHaveBeenCalledWith(id, true);
  })

});
