import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { setEnv } from '../../../../../tests/mocks/env/env.mock';
import { SaveCommentRatingRequestDto } from './dto/save-comment-rating-request.dto';
import { CommentRatingUsecase } from '@/application/usecases/comment-rating/comment-rating-usecase';
import { BadRequestException } from '@nestjs/common';
import { commentsProviders } from './providers/comments-providers';
import { DataBaseConnectionModule } from '@/infrastructure/data-base-connection/data-base-connection.module';

describe('CommentController', () => {
  let controller: CommentController;
  let module: TestingModule;

  let commentRatingUsecase: {
    execute: jest.Mock;
  }

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentRatingUsecase,
          useValue: {
            execute: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<CommentController>(CommentController);
    commentRatingUsecase = module.get(CommentRatingUsecase);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should save a comment of a rating', async () => {
    const dto = new SaveCommentRatingRequestDto("test", '63481037-98dc-40d8-8dc9-733dbadffec4', "94c57e73-d3bd-4522-ab5b-0039af00339e");
    commentRatingUsecase.execute.mockResolvedValue(void 0);
    expect(await controller.commentingRating(dto)).toBe(void 0);
    expect(commentRatingUsecase.execute).toHaveBeenCalledTimes(1);
    expect(commentRatingUsecase.execute).toHaveBeenCalledWith(SaveCommentRatingRequestDto.toCommentRatingUsecaseDto(dto));
  });

  it('shoulg throw a badrequest rating not found', async () => {
    const dto = new SaveCommentRatingRequestDto("test", '63481037-98dc-40d8-8dc9-733dbadffec4', "94c57e73-d3bd-4522-ab5b-0039af00339e");
    commentRatingUsecase.execute.mockRejectedValue(new BadRequestException("Rating not found"))
    await expect(controller.commentingRating(dto)).rejects
      .toMatchObject(new BadRequestException("Rating not found"));
    expect(commentRatingUsecase.execute).toHaveBeenCalledTimes(1);
    expect(commentRatingUsecase.execute).toHaveBeenCalledWith(SaveCommentRatingRequestDto.toCommentRatingUsecaseDto(dto));
  })
});
