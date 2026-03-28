import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { MockRepositoriesForUnitTest } from '../../../../infrastructure/__mocks__/mockRepositories';
import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';
import { CommentEntity } from '../../../../infrastructure/entities/comment/comment.entity';
import { RatingEntity } from '../../../../infrastructure/entities/rating/rating.entity';
import { FindCommentService } from './find.comment.service';

describe('FindCommentService unit tests', () =>{

    it('given an non-existent id should return null', async () => {
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        commentRepository.find = jest.fn()
            .mockImplementationOnce( () =>{
                return null;
            });
        const service = new FindCommentService(commentRepository);

        const wantedId = '1234';
        await expect(service.execute(wantedId)).rejects.toMatchObject({errors: 
            [{context: 'comment', message: 'comment not found'}]
        });
    });

    it('should find a comment', async () =>{
        const comment = DomainMocks.mockComment();
        const rating = mockRating();
        const ratingEntity = RatingEntity.toRatingEntity(rating);
        const entity = CommentEntity.toCommentEntity(comment, ratingEntity);
        
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        commentRepository.find = jest.fn().mockImplementationOnce( () =>{
            return entity;
        });

        const wantedId = comment.getId();
        const service = new FindCommentService(commentRepository);
        const result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.idComment).toBe(wantedId);
        expect(result.comment).toBe(comment.getComment());
        expect(result.createdAt).toBe(comment.getCreatedAt());
        expect(result.idPersonHadDone).toBe(comment.getIdPersonHadDone());
        expect(commentRepository.find).toHaveBeenCalledTimes(1);
        expect(commentRepository.find).toHaveBeenCalledWith(wantedId);
    })

})