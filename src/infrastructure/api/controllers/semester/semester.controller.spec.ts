import { Test, TestingModule } from '@nestjs/testing';
import { SemesterController } from './semester.controller';
import { SemesterUsecases } from '../../../../application/usecases/semester-usecases/semester-usecases';
import { CreateSemesterUsecase } from '../../../../application/usecases/semester-usecases/create/create-semester-usecase';
import { DataBaseConnectionModule } from '../../../data-base-connection/data-base-connection.module';
import { setEnv } from '../../../__mocks__/env.mock';
import { MockSemesterDto } from '../../../__mocks__/mock-semester-dto';
import { AcademicSemesterEntity } from "../../../entities/academic-semester/academic.semester.entity";
import { BadRequestException } from '@nestjs/common';
import { RepositoryFactoryService } from '../../../../infrastructure/factory/repositiry-factory/repository-factory.service';
import { FindAllAcademicSemesterDto } from '../../../../application/services/academic-semester/findAll/findAll.academic-semester.dto';
import { mockQuarterRequestDto } from '../../../../../tests/mocks/controller/quarter-request-dto';
import { mockSemesterRequestDto } from '../../../../../tests/mocks/controller/semester-request-dto';



describe('SemesterController', () => {
  let controller: SemesterController;
  let module: TestingModule;

  beforeAll(async () => {
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

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  }, 5000);

  it('should create a semester', async () => {
    let dto = mockSemesterRequestDto();
    const useCase = jest.spyOn(CreateSemesterUsecase.prototype, 'create')
      .mockImplementation(() => Promise.resolve());
    expect(await controller.create(dto)).toBe(void 0);
    expect(useCase).toHaveBeenCalledTimes(1);
    expect(useCase).toHaveBeenCalledWith(dto);
  });

  it('should throw an error while creating a semester', async () => {
    let quarter = mockQuarterRequestDto();
    let dto = mockSemesterRequestDto(
      { firstQuarter: quarter, secondQuarter: quarter }
    );
    const useCase = jest.spyOn(CreateSemesterUsecase.prototype, 'create')
      .mockImplementationOnce(() => Promise.reject(new BadRequestException('test')));
    await expect(controller.create(dto)).rejects.toMatchObject(new BadRequestException('test'));
    expect(useCase).toHaveBeenCalledTimes(1);
    expect(useCase).toHaveBeenCalledWith(dto);
  });

  it('should delete a semester', async () => {
    // TODO FIX TEST
    // let id = 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6';
    // const useCase = jest.spyOn(SemesterUsecases.prototype, 'delete')
    //   .mockImplementation(() => Promise.resolve());
    // expect(await controller.delete(id)).toBe(void 0);
    // expect(useCase).toHaveBeenCalledTimes(1);
    // expect(useCase).toHaveBeenCalledWith(id);
  });

  it('should find a semester', async () => {
    // TODO FIX TEST
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
    // TODO FIX TEST
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
    // TODO FIX TEST
    // const entities : AcademicSemesterEntity[] = [];
    // const mockResult = new FindAllAcademicSemesterDto(entities);
    // const useCase = jest.spyOn(SemesterUsecases.prototype, 'findAll')
    //  .mockImplementation(async () => await Promise.resolve(mockResult));
    // const result = await controller.findAll();
    // expect(result).toEqual(mockResult);
    // expect(useCase).toHaveBeenCalledTimes(1);
  });

  it('should update a semester', async () => {
    // TODO FIX TEST
    // let id = 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6';
    // const useCase = jest.spyOn(SemesterUsecases.prototype, 'update')
    //  .mockImplementation(() => Promise.resolve());
    // expect(await controller.update(id, true)).toBe(void 0);
    // expect(useCase).toHaveBeenCalledTimes(1);
    // expect(useCase).toHaveBeenCalledWith(id, true);
  })

});
