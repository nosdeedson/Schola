import { Test, TestingModule } from '@nestjs/testing';
import { SemesterController } from './semester.controller';
import { CreateSemesterUsecase } from '../../../../application/usecases/semester-usecases/create/create-semester-usecase';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mockQuarterRequestDto } from '../../../../../tests/mocks/controller/quarter-request-dto-mock';
import { mockSemesterRequestDto } from '../../../../../tests/mocks/controller/semester-request-dto-mock';
import { FindSemesterUsecase } from '@/application/usecases/semester-usecases/find/find-semester-usecase';
import { mockFindAcademicSemesterDto } from '../../../../../tests/mocks/usecases/find-academic-semester-dto.mock';
import { FindAllSemesterUsecase } from '@/application/usecases/semester-usecases/find-all/find-all-semester-usecase';
import { AcademicSemesterEntity } from '@/infrastructure/entities/academic-semester/academic.semester.entity';
import { mockSemester } from '../../../../../tests/mocks/domain/semester.mocks';
import { FindAllAcademicSemesterDto } from '@/application/services/academic-semester/findAll/findAll.academic-semester.dto';
import { UpdateSemesterUseCase } from '@/application/usecases/semester-usecases/update/update-semester.usecase';
import { mockUpdateAcademicSemesterRequestDto } from '../../../../../tests/mocks/controller/update-academic-semester-request-dto-mock';
import { SemesterRequestDto } from './dto/create/semester-request-dto';
import { UpdateAcademicSemesterRequestDto } from './dto/update/update-academic-semester-request-dto';
import { DeleteSemesterUsecase } from '@/application/usecases/semester-usecases/delete/delete-semester-usecase';
import { AcademicSemesterMapper } from '../../../../infrastructure/mappers/semester/academic-semester-mapper';
import { AcademicSemester } from '@/domain/academc-semester/academic.semester';


describe('SemesterController', () => {
  let controller: SemesterController;
  let module: TestingModule;

  let createSemesterUsecase: { execute: jest.Mock; }
  let deleteSemeterUsecase: { execute: jest.Mock; }
  let findSemesterUsecase: { execute: jest.Mock; }
  let findAllSemesterUsecase: { execute: jest.Mock; }
  let updateSemesterUsecase: { execute: jest.Mock; }

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SemesterController],
      providers: [
        {
          provide: CreateSemesterUsecase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: DeleteSemesterUsecase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: FindSemesterUsecase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: FindAllSemesterUsecase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: UpdateSemesterUseCase,
          useValue: { execute: jest.fn() }
        }
      ],
    }).compile();

    controller = module.get<SemesterController>(SemesterController);
    createSemesterUsecase = module.get(CreateSemesterUsecase);
    deleteSemeterUsecase = module.get(DeleteSemesterUsecase);
    findSemesterUsecase = module.get(FindSemesterUsecase);
    findAllSemesterUsecase = module.get(FindAllSemesterUsecase);
    updateSemesterUsecase = module.get(UpdateSemesterUseCase);
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
    createSemesterUsecase.execute.mockResolvedValue(void 0);
    expect(await controller.create(dto)).toBe(void 0);
    expect(createSemesterUsecase.execute).toHaveBeenCalledTimes(1);
    expect(createSemesterUsecase.execute).toHaveBeenCalledWith(SemesterRequestDto.toSemester(dto));
  });

  it('should throw an error while creating a semester', async () => {
    let quarter = mockQuarterRequestDto();
    let dto = mockSemesterRequestDto(
      { firstQuarter: quarter, secondQuarter: quarter }
    );
    createSemesterUsecase.execute.mockRejectedValue(new BadRequestException('test'));
    await expect(controller.create(dto)).rejects.toMatchObject(new BadRequestException('test'));
    expect(createSemesterUsecase.execute).toHaveBeenCalledTimes(1);
    expect(createSemesterUsecase.execute).toHaveBeenCalledWith(SemesterRequestDto.toSemester(dto));
  });

  it('should delete a semester', async () => {
    let id = 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6';
    deleteSemeterUsecase.execute.mockResolvedValue(void 0);
    expect(await controller.delete(id)).toBe(void 0);
    expect(deleteSemeterUsecase.execute).toHaveBeenCalledTimes(1);
    expect(deleteSemeterUsecase.execute).toHaveBeenCalledWith(id);
  });

  it('should find a semester', async () => {
    let id = 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6';
    const mockResult = mockFindAcademicSemesterDto();
    mockResult.id = id;
    findSemesterUsecase.execute.mockResolvedValue(mockResult);
    const result = await controller.find(id);
    expect(result.id).toBe(mockResult.id);
    expect(result.firstQuarter.beginningDate.getTime()).toBe(mockResult.firstQuarter.beginningDate.getTime());
    expect(findSemesterUsecase.execute).toHaveBeenCalledTimes(1);
    expect(findSemesterUsecase.execute).toHaveBeenCalledWith(id);
  });

  it('should find all semester', async () => {
    const class1 = mockSemester();
    const class2 = mockSemester();
    findAllSemesterUsecase.execute.mockResolvedValue(new FindAllAcademicSemesterDto([class1, class2]));
    const result = await controller.findAll();
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect([class1.getId(), class2.getId()].includes(result[0].id)).toBeTruthy();
    expect([class1.getId(), class2.getId()].includes(result[1].id)).toBeTruthy();
    expect(findAllSemesterUsecase.execute).toHaveBeenCalledTimes(1);
  });

  it('should not find any semester', async () => {
    const entities: AcademicSemester[] = [];
    const mockResult = new FindAllAcademicSemesterDto(entities);
    findAllSemesterUsecase.execute.mockResolvedValue(mockResult);
    const result = await controller.findAll();
    expect(result).toHaveLength(0);
    expect(findAllSemesterUsecase.execute).toHaveBeenCalledTimes(1);
  });

  it('should update a semester', async () => {
    let id = 'd90c017a-eabe-4cd5-9dd3-ea8e6c037bd6';
    updateSemesterUsecase.execute.mockResolvedValue(void 0);
    const dto = mockUpdateAcademicSemesterRequestDto();
    expect(await controller.update(dto)).toBe(void 0);
    expect(updateSemesterUsecase.execute).toHaveBeenCalledTimes(1);
    expect(updateSemesterUsecase.execute).toHaveBeenCalledWith(UpdateAcademicSemesterRequestDto.toUsecaseDto(dto));
  });

  it('should throw an error semester not found', async () => {
    let id = '123';
    updateSemesterUsecase.execute.mockRejectedValue(new NotFoundException('Semester not found'));
    const dto = mockUpdateAcademicSemesterRequestDto();
    await expect(controller.update(dto)).rejects.toMatchObject(new NotFoundException("Semester not found"));
    expect(updateSemesterUsecase.execute).toHaveBeenCalledTimes(1);
  });

});
