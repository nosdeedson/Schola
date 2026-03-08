import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setEnv } from '../../../__mocks__/env.mock';
import { MockSchoolgroupDto } from '../../../__mocks__/mock-schoolgroup-dto';
import { DataBaseConnectionModule } from '../../../data-base-connection/data-base-connection.module';
import { SchoolgroupUseCases } from '../../../../application/usecases/schoolgroup-usecases/schoolgroup-usecases';
import { CreateSchoolgroupUseCase } from '../../../../application/usecases/schoolgroup-usecases/create/schoolgroup';
import { UpdateSchoolgroupUsecase } from '../../../../application/usecases/schoolgroup-usecases/update/schoolgroup';
import { SchoolgroupController } from './schoolgroup.controller';
import { UpdateSchoolgroupDto } from './dto/update/update-schoolgroup-dto';
import { RepositoryFactoryService } from '../../../factory/repositiry-factory/repository-factory.service';

describe('SchoolgroupController', () => {
  let controller: SchoolgroupController;
  let module: TestingModule;

  beforeEach(async () => {
    setEnv();
    module = await Test.createTestingModule({
      controllers: [SchoolgroupController],
      providers: [
        SchoolgroupUseCases,
        CreateSchoolgroupUseCase,
        UpdateSchoolgroupUsecase,
        RepositoryFactoryService,
      ],
      imports: [DataBaseConnectionModule]
    }).compile();

    controller = module.get<SchoolgroupController>(SchoolgroupController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    module.close();
  })

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  }, 5000);

  it('should create a schoolgroup', async () => {
    let dto = MockSchoolgroupDto.dtoToCreate();
    const usecases = jest.spyOn(CreateSchoolgroupUseCase.prototype, 'create')
      .mockImplementationOnce(() => Promise.resolve())
    expect(await controller.create(dto)).toBe(void 0);
    expect(usecases).toHaveBeenCalledTimes(1);
    expect(usecases).toHaveBeenCalledWith(dto);
  })

  it('should throw an exception', async () => {
    let dto = MockSchoolgroupDto.dtoToCreateCausingException();
    const usecases = jest.spyOn(CreateSchoolgroupUseCase.prototype, 'create')
      .mockImplementationOnce(() => Promise.reject(new BadRequestException("test")));
    try {
      await controller.create(dto)
    } catch (error) {
      expect(error).toBeDefined();
      expect(usecases).toHaveBeenCalledTimes(1);
      expect(usecases).toHaveBeenCalledWith(dto);
    }
  })

  it('should delete a schoolgroup', async () => {
    let wantedId = '16efc675-a208-43fe-93dd-8b9a3eebe656';
    const usecases = jest.spyOn(SchoolgroupUseCases.prototype, 'delete')
      .mockImplementationOnce(() => Promise.resolve());
    expect(await controller.delete(wantedId)).toBe(void 0);
    expect(usecases).toHaveBeenCalledTimes(1);
    expect(usecases).toHaveBeenCalledWith(wantedId);
  })

  it('should return a schoolgroup', async () => {
    let wantedId = 'bc7746a2-5c78-4e3b-beea-ed6b5f57c7eb';
    let response = MockSchoolgroupDto.dtoFind();
    const usecases = jest.spyOn(SchoolgroupUseCases.prototype, 'find')
      .mockImplementationOnce(async () => await Promise.resolve(response));
    let result = await controller.find(wantedId);
    expect(result).toBeDefined();
    expect(result).toStrictEqual(response);
    expect(usecases).toHaveBeenCalledTimes(1);
    expect(usecases).toHaveBeenCalledWith(wantedId);
  })

  it('should return all schoolgroup', async () => {
    let response = MockSchoolgroupDto.dtoFindAll();
    const usecases = jest.spyOn(SchoolgroupUseCases.prototype, 'findAll')
      .mockImplementationOnce(async () => await Promise.resolve(response));
    let result = await controller.findAll();
    expect(result).toBeDefined();
    expect(result).toStrictEqual(response);
    expect(usecases).toHaveBeenCalledTimes(1);
  })

  it('should update schoolgroup', async () => {
    const usecases = jest.spyOn(UpdateSchoolgroupUsecase.prototype, 'update')
      .mockImplementationOnce(async () => await Promise.resolve());
    let dto = new UpdateSchoolgroupDto();
    dto.id = '16efc675-a208-43fe-93dd-8b9a3eebe656';
    dto.teacherName = 'new teacher';
    dto.nameBook = "name book"
    expect(await controller.update(dto)).toBe(void 0);
    expect(usecases).toHaveBeenCalledTimes(1);
    expect(usecases).toHaveBeenCalledWith(dto)
  })

});
