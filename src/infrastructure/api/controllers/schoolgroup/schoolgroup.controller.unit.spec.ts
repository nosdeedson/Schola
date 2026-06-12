import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setEnv } from '../../../../../tests/mocks/env/env.mock';
import { DataBaseConnectionModule } from '../../../data-base-connection/data-base-connection.module';
import { SchoolgroupController } from './schoolgroup.controller';
import { CreateSchoolgroupUseCase } from '@/application/usecases/schoolgroup-usecases/create/create-schoolgroup-usecase';
import { UpdateSchoolgroupUsecase } from '@/application/usecases/schoolgroup-usecases/update/update-schoolgroup-usecase';
import { mockCreateSchoolgroupRequestDto } from '../../../../../tests/mocks/controller/schoolgroup-request-dto-mock';
import { mockUpdateSchoolgroupRequestDto } from '../../../../../tests/mocks/controller/update-schoolgroup-request-dto-mock';
import { FindSchoolgroupUsecase } from '@/application/usecases/schoolgroup-usecases/find/find-schoolgroup-usecase';
import { schoolgroupsProviders } from './providers/schoolgroups.providers';
import { mockFindClassDto } from '../../../../../tests/mocks/controller/find-class-dto-mock';
import { DeleteSchoolgroupUsecase } from '@/application/usecases/schoolgroup-usecases/delete/delete-schoolgroup-usecase';
import { FindAllClassDto } from '@/application/services/class/findAll/findAll.class.dto';
import { ClassEntity } from '@/infrastructure/entities/class/class.entity';
import { mockClass } from '../../../../../tests/mocks/domain/class.mocks';
import { FindAllSchoolgroupUsecase } from '@/application/usecases/schoolgroup-usecases/findall/find-all-schoolgroup-usecase';

describe('SchoolgroupController', () => {
  let controller: SchoolgroupController;
  let module: TestingModule;

  let createSchoolgroupUseCase: { execute: jest.Mock; }
  let deleteSchoolgroupUsecase: { execute: jest.Mock; }
  let findSchoolgroupUsecase: { execute: jest.Mock; }
  let findAllSchoolgroupUsecase: { execute: jest.Mock; }
  let updateSchoolgroupUsecase: { execute: jest.Mock; }

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SchoolgroupController],
      providers: [
        {
          provide: CreateSchoolgroupUseCase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: DeleteSchoolgroupUsecase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: FindSchoolgroupUsecase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: FindAllSchoolgroupUsecase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: UpdateSchoolgroupUsecase,
          useValue: { execute: jest.fn() }
        }
      ],
    }).compile();

    controller = module.get<SchoolgroupController>(SchoolgroupController);
    createSchoolgroupUseCase = module.get(CreateSchoolgroupUseCase);
    deleteSchoolgroupUsecase = module.get(DeleteSchoolgroupUsecase);
    findSchoolgroupUsecase = module.get(FindSchoolgroupUsecase);
    findAllSchoolgroupUsecase = module.get(FindAllSchoolgroupUsecase);
    updateSchoolgroupUsecase = module.get(UpdateSchoolgroupUsecase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  describe('create class', () => {
    it('should create a schoolgroup', async () => {
      let dto = mockCreateSchoolgroupRequestDto();
      createSchoolgroupUseCase.execute.mockResolvedValue(void 0);
      expect(await controller.create(dto)).toBe(void 0);
      expect(createSchoolgroupUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createSchoolgroupUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it('should throw an exception', async () => {
      let dto = mockCreateSchoolgroupRequestDto();
      createSchoolgroupUseCase.execute.mockRejectedValue(new BadRequestException("test"));
      await expect(controller.create(dto)).rejects.toMatchObject(new BadRequestException('test'));
      expect(createSchoolgroupUseCase.execute).toHaveBeenCalledTimes(1);
      expect(createSchoolgroupUseCase.execute).toHaveBeenCalledWith(dto);
    });
  });

  describe('delete a schoolgroup', () => {
    it('should delete a schoolgroup', async () => {
      let wantedId = '16efc675-a208-43fe-93dd-8b9a3eebe656';
      deleteSchoolgroupUsecase.execute.mockResolvedValue(void 0);
      expect(await controller.delete(wantedId)).toBe(void 0);
      expect(deleteSchoolgroupUsecase.execute).toHaveBeenCalledTimes(1);
      expect(deleteSchoolgroupUsecase.execute).toHaveBeenCalledWith(wantedId);
    })
  });

  describe('find schoolgroup', () => {
    it('should find a schoolgroup', async () => {
      const dto = mockFindClassDto();
      let wantedId = dto.id;
      findSchoolgroupUsecase.execute.mockResolvedValue(dto);
      const result = await controller.find(wantedId);
      expect(result).toBeDefined();
      expect(result.id).toBe(dto.id);
      expect(findSchoolgroupUsecase.execute).toHaveBeenCalledTimes(1);
      expect(findSchoolgroupUsecase.execute).toHaveBeenCalledWith(wantedId);
    });
  });

  describe('find all schoolgroup', () => {

    it('should return all schoolgroup', async () => {
      const entity1 = ClassMapper.fromDomain(mockClass());
      const entity2 = ClassMapper.fromDomain(mockClass());
      const entities = new FindAllClassDto([entity1, entity2]);
      findAllSchoolgroupUsecase.execute.mockResolvedValue(entities);
      const result = await controller.findAll();
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(findAllSchoolgroupUsecase.execute).toHaveBeenCalledTimes(1)
    })
  });

  describe('update class', () => {
    it('should update schoolgroup', async () => {
      const dto = mockUpdateSchoolgroupRequestDto();
      updateSchoolgroupUsecase.execute.mockResolvedValue(void 0);
      expect(await controller.update(dto)).toBe(void 0);
      expect(updateSchoolgroupUsecase.execute).toHaveBeenCalledTimes(1);
      expect(updateSchoolgroupUsecase.execute).toHaveBeenCalledWith(dto);
    });

    it('should throw an exception', async () => {
      const dto = mockUpdateSchoolgroupRequestDto();
      updateSchoolgroupUsecase.execute.mockRejectedValue(new BadRequestException('test'));
      await expect(controller.update(dto)).rejects.toMatchObject(new BadRequestException('test'));
      expect(updateSchoolgroupUsecase.execute).toHaveBeenCalledTimes(1);
      expect(updateSchoolgroupUsecase.execute).toHaveBeenCalledWith(dto);
    });
  });

});
