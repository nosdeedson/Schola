import { UpdateCommentService } from './update.comment.service';
import { UpdateCommentDto } from './update.comment.dto';
import { MockRepositoriesForUnitTest } from '../../../../infrastructure/__mocks__/mockRepositories'
import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';
import { CommentEntity} from '../../../../infrastructure/entities/comment/comment.entity';
import { RatingEntity } from '../../../../infrastructure/entities/rating/rating.entity';

describe('UpdateCommentService unit tests', () =>{

    afterEach(async () =>{
        jest.clearAllMocks();
    })

    it('should throw a systemError while updating a comment with wrong id', async () =>{
        const wrongId = '1234';
        const dto = new UpdateCommentDto(wrongId, 'changing comment');
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        commentRepository.find = jest.fn().mockImplementationOnce(() =>{
            return null;
        });

        const service = new UpdateCommentService(commentRepository);

        try {
            await service.execute(dto);
        } catch (error) {
            //@ts-ignore
            expect(error.errors).toBeDefined();
            //@ts-ignore
            expect(error.errors).toMatchObject([{context: 'comment', message: 'comment not found'}]);
        }
    });

    it('should update a comment', async () =>{
        const comment = DomainMocks.mockComment();
        const rating = DomainMocks.mockRating();
        const ratingEntity = RatingEntity.toRatingEntity(rating);
        const entity = CommentEntity.toCommentEntity(comment, ratingEntity);
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();

        const wantedComment = "changing comment";
        const wantedUpdatedAt = new Date();

        commentRepository.find = jest.fn().mockImplementationOnce(() =>{ return entity});
        commentRepository.update = jest.fn().mockImplementationOnce(() => {
            entity.comment = wantedComment;
            entity.updatedAt = wantedUpdatedAt;
        })
        
        const commentBefore = entity.comment;
        expect(entity.comment).toBe(commentBefore)
        const dto = new UpdateCommentDto(comment.getId(), wantedComment);
        const service = new UpdateCommentService(commentRepository);
        expect(await service.execute(dto)).toBe(void 0);
        expect(commentRepository.find).toHaveBeenCalledTimes(1)
        expect(commentRepository.find).toHaveBeenCalledWith(dto.idComment)
        expect(commentRepository.update).toHaveBeenCalledTimes(1);
        expect(entity.comment).toBe(wantedComment);
        expect(entity.updatedAt).toEqual(wantedUpdatedAt);
    })

})