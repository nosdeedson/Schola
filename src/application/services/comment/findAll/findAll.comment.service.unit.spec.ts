import { RatingEntity } from '../../../../infrastructure/entities/rating/rating.entity';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { CommentEntity } from '../../../../infrastructure/entities/comment/comment.entity';
import { FindAllCommentService } from './findAll.comment.service';
import { mockRating } from '../../../../../tests/mocks/domain/rating.mocks';
import { mockComment } from '../../../../../tests/mocks/domain/comment.mocks';
import { RatingMapper } from '@/infrastructure/mappers/rating/rating-mapper';
import { CommentMapper } from '@/infrastructure/mappers/comment/comment-mapper';

describe('FindAllCommentService unit tests', () => {

    it('should return an empty array of comments', async () => {
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        commentRepository.findAll = jest.fn().mockReturnValueOnce(null)
        const service = new FindAllCommentService(commentRepository);

        const results = await service.execute();
        expect(results.all.length).toBe(0);
        expect(commentRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should find all comments', async () => {
        const comment = mockComment();
        const rating = mockRating();
        const ratingEntity = RatingMapper.fromDomain(rating);
        const entities = CommentMapper.fromDomain(comment, ratingEntity);
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        commentRepository.findAll = jest.fn().mockImplementationOnce(() => {
            return [entities]
        });
        const service = new FindAllCommentService(commentRepository);
        const results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all[0].comment).toEqual(entities.comment)
        expect(results.all[0].createdAt).toEqual(entities.createdAt)
        expect(results.all[0].idComment).toEqual(entities.id)
        expect(results.all[0].namePersonHadDone).toEqual(entities.namePersonHaveDone)
    });

});
