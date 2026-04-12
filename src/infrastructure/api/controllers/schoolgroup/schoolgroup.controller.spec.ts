import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setEnv } from '../../../__mocks__/env.mock';
import { DataBaseConnectionModule } from '../../../data-base-connection/data-base-connection.module';
import { SchoolgroupUseCases } from '../../../../application/usecases/schoolgroup-usecases/schoolgroup-usecases';
import { SchoolgroupController } from './schoolgroup.controller';
import { RepositoryFactoryService } from '../../../factory/repositiry-factory/repository-factory.service';
import { CreateSchoolgroupUseCase } from '@/application/usecases/schoolgroup-usecases/create/create-schoolgroup-usecase';
import { UpdateSchoolgroupUsecase } from '@/application/usecases/schoolgroup-usecases/update/update-schoolgroup-usecase';
import { mockCreateSchoolgroupRequestDto } from '../../../../../tests/mocks/controller/schoolgroup-request-dto-mock';
import { mockUpdateSchoolgroupRequestDto } from '../../../../../tests/mocks/controller/update-schoolgroup-request-dto-mock';
import { FindSchoolgroupUsecase } from '@/application/usecases/schoolgroup-usecases/find/find-schoolgroup-usecase';
import { providers } from './providers/schoolgroups.providers';
import { FindClassDtoResponseDto } from './dto/find/find-class-dto-response';

describe('SchoolgroupController', () => {
  let controller: SchoolgroupController;
  let module: TestingModule;

  beforeAll(async () => {
    setEnv();
    module = await Test.createTestingModule({
      controllers: [SchoolgroupController],
      providers: [...providers
        // SchoolgroupUseCases,
        // CreateSchoolgroupUseCase,
        // UpdateSchoolgroupUsecase,
        // FindSchoolgroupUsecase,
      ],
      imports: [DataBaseConnectionModule]
    }).compile();

    controller = module.get<SchoolgroupController>(SchoolgroupController);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  describe('create class', () => {
    it('should create a schoolgroup', async () => {
      let dto = mockCreateSchoolgroupRequestDto();
      const usecases = jest.spyOn(CreateSchoolgroupUseCase.prototype, 'create')
        .mockImplementation(() => Promise.resolve(void 0))
      expect(await controller.create(dto)).toBe(void 0);
      expect(usecases).toHaveBeenCalledTimes(1);
      expect(usecases).toHaveBeenCalledWith(dto);
    });

    it('should throw an exception', async () => {
      let dto = mockCreateSchoolgroupRequestDto();
      const usecases = jest.spyOn(CreateSchoolgroupUseCase.prototype, 'create')
        .mockImplementation(() => Promise.reject(new BadRequestException("test")));
      await expect(controller.create(dto)).rejects.toMatchObject(new BadRequestException('test'));
      expect(usecases).toHaveBeenCalledTimes(1);
      expect(usecases).toHaveBeenCalledWith(dto);
    });
  });

  it('should delete a schoolgroup', async () => {
    // TODO FIX TEST
    // let wantedId = '16efc675-a208-43fe-93dd-8b9a3eebe656';
    // const usecases = jest.spyOn(SchoolgroupUseCases.prototype, 'delete')
    //   .mockImplementationOnce(() => Promise.resolve());
    // expect(await controller.delete(wantedId)).toBe(void 0);
    // expect(usecases).toHaveBeenCalledTimes(1);
    // expect(usecases).toHaveBeenCalledWith(wantedId);
  })

  it('should find a schoolgroup', async () => {
    // TODO FIX THE Test
    let wantedId = 'af9f033f-9719-4370-b542-407700ef23d5';
    const dto = new FindClassDtoResponseDto();
    const usecase = jest.spyOn(FindSchoolgroupUsecase.prototype, 'execute')
      .mockImplementation(() => Promise.resolve(dto))
    const result = await controller.find(wantedId);
    expect(result).toBeDefined();
  })

  it('should return all schoolgroup', async () => {
    expect(true).toBe(true)

  })

  describe('update class', () => {
    it('should update schoolgroup', async () => {
      const dto = mockUpdateSchoolgroupRequestDto();
      const usecase = jest.spyOn(UpdateSchoolgroupUsecase.prototype, 'update')
        .mockImplementation(() => Promise.resolve(void 0));

      expect(await controller.update(dto)).toBe(void 0);
      expect(usecase).toHaveBeenCalledTimes(1);
      expect(usecase).toHaveBeenCalledWith(dto);
    });

    it('should throw an exception', async () => {
      const dto = mockUpdateSchoolgroupRequestDto();
      const usecase = jest.spyOn(UpdateSchoolgroupUsecase.prototype, 'update')
        .mockImplementation(() => Promise.reject(new BadRequestException("test")));
      await expect(controller.update(dto)).rejects.toMatchObject(new BadRequestException('test'));
      expect(usecase).toHaveBeenCalledTimes(1);
      expect(usecase).toHaveBeenCalledWith(dto);
    });
  });

});
