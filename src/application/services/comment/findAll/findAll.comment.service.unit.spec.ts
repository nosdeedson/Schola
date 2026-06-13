import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { FindAllCommentService } from './findAll.comment.service';
import { mockRating } from '../../../../../tests/mocks/domain/rating.mocks';
import { mockComment } from '../../../../../tests/mocks/domain/comment.mocks';
import { RatingMapper } from '@/infrastructure/mappers/rating/rating-mapper';
import { CommentMapper } from '@/infrastructure/mappers/comment/comment-mapper';
import { cp } from 'fs';

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
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        commentRepository.findAll = jest.fn().mockImplementationOnce(() => {
            return [comment]
        });
        const service = new FindAllCommentService(commentRepository);
        const results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all[0].comment).toEqual(comment.getComment())
        expect(results.all[0].createdAt).toEqual(comment.getCreatedAt())
        expect(results.all[0].idComment).toEqual(comment.getId())
        expect(results.all[0].namePersonHadDone).toEqual(comment.getNamePersonHaveDone())
    });

});
