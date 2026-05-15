import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { setEnv } from '../../../../../tests/mocks/env/env.mock';
import { SaveCommentRatingRequestDto } from './dto/save-comment-rating-request.dto';
import { CommentRatingUsecase } from '@/application/usecases/comment-rating/comment-rating-usecase';
import { BadRequestException } from '@nestjs/common';
import { providers } from './providers/comments-providers';
import { DataBaseConnectionModule } from '@/infrastructure/data-base-connection/data-base-connection.module';

describe('CommentController', () => {
  let controller: CommentController;
  let module: TestingModule;

  beforeAll(async () => {
    setEnv();
    module = await Test.createTestingModule({
      controllers: [CommentController],
      imports: [DataBaseConnectionModule],
      providers: [...providers]
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should save a comment of a rating', async () => {
    const dto = new SaveCommentRatingRequestDto("test", '63481037-98dc-40d8-8dc9-733dbadffec4', "94c57e73-d3bd-4522-ab5b-0039af00339e");
    const studentCommentRating = jest.spyOn(CommentRatingUsecase.prototype, 'execute')
      .mockImplementation(() => Promise.resolve(void 0));
    expect(await controller.commentingRating(dto)).toBe(void 0);
    expect(studentCommentRating).toHaveBeenCalledTimes(1);
    expect(studentCommentRating).toHaveBeenCalledWith(dto.toCommentRatingUsecaseDto());
  });

  it('shoulg throw a badrequest rating not found', async () => {
    const dto = new SaveCommentRatingRequestDto("test", '63481037-98dc-40d8-8dc9-733dbadffec4', "94c57e73-d3bd-4522-ab5b-0039af00339e");
    const studentCommentRating = jest.spyOn(CommentRatingUsecase.prototype, 'execute')
      .mockImplementation(() => { throw new BadRequestException("Rating not found") });
    await expect(controller.commentingRating(dto)).rejects
      .toMatchObject(new BadRequestException("Rating not found"));
    expect(studentCommentRating).toHaveBeenCalledTimes(1);
    expect(studentCommentRating).toHaveBeenCalledWith(dto.toCommentRatingUsecaseDto());
  })
});
