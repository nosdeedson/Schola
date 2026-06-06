import { Test, TestingModule } from '@nestjs/testing';
import { RatingController } from './rating.controller';
import { mockSaveRatingRequest } from "../../../../../tests/mocks/controller/save-rating-request-dto-mock";
import { SaveRatingUsecase } from '@/application/usecases/save-rating/save-rating-usecase';
import { BadRequestException } from '@nestjs/common';
import { SaveRatingRequestDto } from './dto/save-rating-request-dto';

describe('RatingController', () => {
  let controller: RatingController;
  let module: TestingModule;

  let saveRatingUsecase: {
    execute: jest.Mock;
  };
  // TODO HOW TO TEST CONTROLLER WITHOUT DEPENDING ON DATABASE CONNECTION
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [RatingController],
      providers: [
        {
          provide: SaveRatingUsecase,
          useValue: {
            execute: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<RatingController>(RatingController);
    saveRatingUsecase = module.get(SaveRatingUsecase);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a rating', async () => {
    const request = mockSaveRatingRequest();
    saveRatingUsecase.execute.mockResolvedValue(void 0)
    expect(await controller.saveRating(request)).toBe(void 0);
    expect(saveRatingUsecase.execute).toHaveBeenCalledTimes(1);
    expect(saveRatingUsecase.execute).toHaveBeenCalledWith(SaveRatingRequestDto.toUseCaseDto(request));
  });

  it('should throw an error', async () => {
    const request = mockSaveRatingRequest();
    saveRatingUsecase.execute.mockRejectedValue(new BadRequestException('student not found'))
    await expect(controller.saveRating(request)).rejects
      .toMatchObject(new BadRequestException("student not found"));
    expect(saveRatingUsecase.execute).toHaveBeenCalledTimes(1);
    expect(saveRatingUsecase.execute).toHaveBeenCalledWith(SaveRatingRequestDto.toUseCaseDto(request));
  });

  it('should throw an error current semester not found', async () => {
    const request = mockSaveRatingRequest();
    saveRatingUsecase.execute.mockRejectedValue(new BadRequestException('Current semester was not found'))
    await expect(controller.saveRating(request)).rejects
      .toMatchObject(new BadRequestException("Current semester was not found"));
    expect(saveRatingUsecase.execute).toHaveBeenCalledTimes(1);
    expect(saveRatingUsecase.execute).toHaveBeenCalledWith(SaveRatingRequestDto.toUseCaseDto(request));
  });
});
