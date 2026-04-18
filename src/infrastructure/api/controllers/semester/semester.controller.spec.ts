import { Test, TestingModule } from '@nestjs/testing';
import { SemesterController } from './semester.controller';
import { CreateSemesterUsecase } from '../../../../application/usecases/semester-usecases/create/create-semester-usecase';
import { DataBaseConnectionModule } from '../../../data-base-connection/data-base-connection.module';
import { setEnv } from '../../../__mocks__/env.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mockQuarterRequestDto } from '../../../../../tests/mocks/controller/quarter-request-dto';
import { mockSemesterRequestDto } from '../../../../../tests/mocks/controller/semester-request-dto';
import { providers } from './providers/semesters.providers';
import { DelesteSemesterUsecase } from '@/application/usecases/semester-usecases/delete/delete-semester-usecase';
import { FindSemesterUsecase } from '@/application/usecases/semester-usecases/find/find-semester-usecase';
import { mockFindAcademicSemesterDto } from '../../../../../tests/mocks/usecases/find-academic-semester-dto.mock';
import { FindAllSemesterUsecase } from '@/application/usecases/semester-usecases/find-all/find-all-semester-usecase';
import { AcademicSemesterEntity } from '@/infrastructure/entities/academic-semester/academic.semester.entity';
import { mockSemester } from '../../../../../tests/mocks/domain/semester.mocks';
import { FindAllAcademicSemesterDto } from '@/application/services/academic-semester/findAll/findAll.academic-semester.dto';
import { FindSemesterResponseDto } from './dto/find/find-semester-response-dto';
import { UpdateSemesterUseCase } from '@/application/usecases/semester-usecases/update/update-semester.usecase';
import { mockUpdateAcademicSemesterRequestDto } from '../../../../../tests/mocks/controller/update-academic-semester-request-dto-mock';
import { mockUpdateSemesterDto } from '../../../../../tests/mocks/domain-dto/update-semester-dto.mocks';


describe('SemesterController', () => {
  let controller: SemesterController;
  let module: TestingModule;

  beforeAll(async () => {
    setEnv();
    module = await Test.createTestingModule({
      controllers: [SemesterController],
      providers: [...providers],
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
  });

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
    let id = 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6';
    const useCase = jest.spyOn(DelesteSemesterUsecase.prototype, 'execute')
      .mockImplementation(() => Promise.resolve(void 0));
    expect(await controller.delete(id)).toBe(void 0);
    expect(useCase).toHaveBeenCalledTimes(1);
    expect(useCase).toHaveBeenCalledWith(id);
  });

  it('should find a semester', async () => {
    let id = 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6';
    const mockResult = mockFindAcademicSemesterDto();
    mockResult.id = id;
    const useCase = jest.spyOn(FindSemesterUsecase.prototype, 'execute')
      .mockImplementation(async () => Promise.resolve(mockResult));
    const result = await controller.find(id);
    expect(result.id).toBe(mockResult.id);
    expect(result.firstQuarter.beginningDate.getTime()).toBe(mockResult.firstQuarter.beginningDate.getTime());
    expect(useCase).toHaveBeenCalledTimes(1);
    expect(useCase).toHaveBeenCalledWith(id);
  });

  it('should find all semester', async () => {
    const entity1 = AcademicSemesterEntity.toEntity(mockSemester());
    const entity2 = AcademicSemesterEntity.toEntity(mockSemester());
    const useCase = jest.spyOn(FindAllSemesterUsecase.prototype, 'execute')
      .mockImplementation(() => Promise.resolve(new FindAllAcademicSemesterDto([entity1, entity2])))

    const result = await controller.findAll();
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect([entity1.id, entity2.id].includes(result[0].id)).toBeTruthy();
    expect([entity1.id, entity2.id].includes(result[1].id)).toBeTruthy();
    expect(useCase).toHaveBeenCalledTimes(1);
  });

  it('should not find any semester', async () => {
    const entities: AcademicSemesterEntity[] = [];
    const mockResult = new FindAllAcademicSemesterDto(entities);
    const useCase = jest.spyOn(FindAllSemesterUsecase.prototype, 'execute')
      .mockImplementation(async () => await Promise.resolve(mockResult));
    const result = await controller.findAll();
    expect(result).toHaveLength(0);
    expect(useCase).toHaveBeenCalledTimes(1);
  });

  it('should update a semester', async () => {
    let id = 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6';
    const useCase = jest.spyOn(UpdateSemesterUseCase.prototype, 'execute')
      .mockImplementation(() => Promise.resolve(void 0));
    const dto = mockUpdateAcademicSemesterRequestDto();
    expect(await controller.update(dto)).toBe(void 0);
    expect(useCase).toHaveBeenCalledTimes(1);
    expect(useCase).toHaveBeenCalledWith(dto);
  });

  it('should throw an error semester not found', async () => {
    let id = '123';
    const useCase = jest.spyOn(UpdateSemesterUseCase.prototype, 'execute')
      .mockImplementation(() => { throw new NotFoundException("Semester not found") });
    const dto = mockUpdateAcademicSemesterRequestDto();
    await expect(controller.update(dto)).rejects.toMatchObject(new NotFoundException("Semester not found"));
  });

});
