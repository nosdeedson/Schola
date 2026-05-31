import { ExceptionHandler } from "@/infrastructure/utils/exception-handler/exception-handler";
import { MockRepositoriesForUnitTest } from "../../../../tests/mocks/mock-repositories/mockRepositories";
import { mockStudentRatingUsecaseDto } from "../../../../tests/mocks/usecases/student-comment-rating-usecase-dto.mock";
import { mockStudentRatingUsecaseDtoOut } from "../../../../tests/mocks/usecases/student-rating-usecase-dto.mocks";
import { CommentRatingUsecase } from "./comment-rating-usecase";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { mockRating } from "../../../../tests/mocks/domain/rating.mocks";
import { CreateCommentService } from "@/application/services/comment/create/create.comment.service";
import { QueryFailedError } from "typeorm";
import { rejects } from "assert";

describe('CommentRatingUsecase', () => {

    afterEach(async () => { jest.clearAllMocks() });

    it('should not find a rating', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.find = jest.fn().mockImplementation(() => Promise.resolve(null));
        const exceptionHandler = jest.spyOn(ExceptionHandler, 'exceptionHandler')
            .mockImplementation(() => { throw new NotFoundException('rating not found') })
        const usecase = new CommentRatingUsecase(ratingRepository, commentRepository);
        const dto = mockStudentRatingUsecaseDto()
        await expect(usecase.execute(dto)).rejects.toMatchObject(new NotFoundException('rating not found'));
        expect(exceptionHandler).toHaveBeenCalledTimes(1);
    });

    it('should create a comment', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const ratingEntity = RatingEntity.toRatingEntity(mockRating());
        ratingRepository.find = jest.fn().mockImplementation(() => Promise.resolve(ratingEntity));
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const commentService = jest.spyOn(CreateCommentService.prototype, 'execute')
            .mockImplementation(() => Promise.resolve(void 0));
        const usecase = new CommentRatingUsecase(ratingRepository, commentRepository);
        const dto = mockStudentRatingUsecaseDto();
        expect(await usecase.execute(dto)).toBe(void 0);
        expect(commentService).toHaveBeenCalledTimes(1);
    });

    it('while creating a comment should throw an error', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const ratingEntity = RatingEntity.toRatingEntity(mockRating());
        ratingRepository.find = jest.fn().mockImplementation(() => Promise.resolve(ratingEntity));
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const commentService = jest.spyOn(CreateCommentService.prototype, 'execute')
            .mockImplementation(() => { throw new QueryFailedError(null, null, new Error('Failed')) });
        const exceptionHandler = jest.spyOn(ExceptionHandler, 'exceptionHandler')
            .mockImplementation(() => { throw new InternalServerErrorException("failed") })
        const usecase = new CommentRatingUsecase(ratingRepository, commentRepository);
        const dto = mockStudentRatingUsecaseDto();
        await expect(usecase.execute(dto)).rejects.toThrow(InternalServerErrorException);
        expect(commentService).toHaveBeenCalledTimes(1);
        expect(exceptionHandler).toHaveBeenCalledTimes(1)
    });

})
