import { Test, TestingModule } from '@nestjs/testing';
import { RatingController } from './rating.controller';
import { DataBaseConnectionModule } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { setEnv } from '@/infrastructure/__mocks__/env.mock';
import { providers } from './providers/ratings.providers';
import { mockSaveRatingRequest } from "../../../../../tests/mocks/controller/save-rating-request-dto-mock";
import { SaveRatingUsecase } from '@/application/usecases/save-rating/save-rating-usecase';
import { BadRequestException } from '@nestjs/common';
import { TrataErros } from '@/infrastructure/utils/trata-erros/trata-erros';
import { SystemError } from '@/application/services/@shared/system-error';
describe('RatingController', () => {
  let controller: RatingController;
  let module: TestingModule;

  beforeAll(async () => {
    setEnv();
    module = await Test.createTestingModule({
      controllers: [RatingController],
      imports: [DataBaseConnectionModule],
      providers: [...providers]
    }).compile();

    controller = module.get<RatingController>(RatingController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a rating', async () => {
    const request = mockSaveRatingRequest();
    const usecase = jest.spyOn(SaveRatingUsecase.prototype, 'execute')
      .mockImplementation(() => Promise.resolve(void 0));
    expect(await controller.saveRating(request)).toBe(void 0);
    expect(usecase).toHaveBeenCalledTimes(1);
    expect(usecase).toHaveBeenCalledWith(request.toUseCaseDto());
  });

  it('should throw an error', async () => {
    const request = mockSaveRatingRequest();
    const usecase = jest.spyOn(SaveRatingUsecase.prototype, 'execute')
      .mockImplementation(() => { throw new BadRequestException("student not found") });
    await expect(controller.saveRating(request)).rejects
      .toMatchObject(new BadRequestException("student not found"));
    expect(usecase).toHaveBeenCalledTimes(1);
    expect(usecase).toHaveBeenCalledWith(request.toUseCaseDto());
  });

  it('should throw an error current semester not found', async () => {
    const request = mockSaveRatingRequest();
    const usecase = jest.spyOn(SaveRatingUsecase.prototype, 'execute')
      .mockImplementation(() => { throw new BadRequestException("Current semester was not found") });
    await expect(controller.saveRating(request)).rejects
      .toMatchObject(new BadRequestException("Current semester was not found"));
    expect(usecase).toHaveBeenCalledTimes(1);
    expect(usecase).toHaveBeenCalledWith(request.toUseCaseDto());
  });
});
