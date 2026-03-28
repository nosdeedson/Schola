import { RatingEntity } from '../../../../infrastructure/entities/rating/rating.entity';
import { MockRepositoriesForUnitTest } from '../../../../infrastructure/__mocks__/mockRepositories';
import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';
import { CommentEntity } from '../../../../infrastructure/entities/comment/comment.entity';
import { FindAllCommentService } from './findAll.comment.service';
import { mockRating } from '../../../../../tests/mocks/domain/rating.mocks';

describe('FindAllCommentService unit tests', () => {

    it('should return an empty array of comments', async () =>{
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        commentRepository.findAll = jest.fn().mockReturnValueOnce( null)
        const service = new FindAllCommentService(commentRepository);

        const results = await service.execute();
        expect(results.all.length).toBe(0);
        expect(commentRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should find all comments', async () =>{
        const comment = DomainMocks.mockComment();
        const rating = mockRating();
        const ratingEntity = RatingEntity.toRatingEntity(rating);
        const entities = CommentEntity.toCommentEntity(comment, ratingEntity);
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        commentRepository.findAll = jest.fn().mockImplementationOnce(() =>{
            return [entities]
        });
        const service = new FindAllCommentService(commentRepository);
        const results = await service.execute();
        expect(results).toBeDefined();
        expect(results.all[0].comment).toEqual(entities.comment)
        expect(results.all[0].createdAt).toEqual(entities.createdAt)
        expect(results.all[0].idComment).toEqual(entities.id)
        expect(results.all[0].idPersonHadDone).toEqual(entities.idPersonHaveDone)
    });

});