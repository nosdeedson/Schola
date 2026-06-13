import { UpdateCommentService } from './update.comment.service';
import { UpdateCommentDto } from './update.comment.dto';
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories'
import { mockRating } from '../../../../../tests/mocks/domain/rating.mocks';
import { mockComment } from '../../../../../tests/mocks/domain/comment.mocks';
import { CommentMapper } from '@/infrastructure/mappers/comment/comment-mapper';
import { CommentEntity } from '@/infrastructure/entities/comment/comment.entity';

describe('UpdateCommentService unit tests', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it('should throw a systemError while updating a comment with wrong id', async () => {
        const wrongId = '1234';
        const dto = new UpdateCommentDto(wrongId, 'changing comment');
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        commentRepository.find = jest.fn().mockImplementationOnce(() => {
            return null;
        });

        const service = new UpdateCommentService(commentRepository);

        await expect(service.execute(dto)).rejects
            .toMatchObject([{ context: 'comment', message: 'comment not found' }]);
    });

    it('should update a comment', async () => {
        const comment = mockComment();
        const rating = mockRating();
        comment.setRating(rating)
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();

        const wantedComment = "changing comment";
        const wantedUpdatedAt = new Date();

        commentRepository.find = jest.fn().mockImplementationOnce(() => comment);
        commentRepository.update = jest.fn().mockImplementationOnce(() => {
            comment.setUpdatedAt(wantedUpdatedAt),
                comment.setComment(wantedComment)
        })

        const dto = new UpdateCommentDto(comment.getId(), wantedComment);
        const service = new UpdateCommentService(commentRepository);
        expect(await service.execute(dto)).toBe(void 0);
        expect(commentRepository.find).toHaveBeenCalledTimes(1)
        expect(commentRepository.find).toHaveBeenCalledWith(dto.idComment)
        expect(commentRepository.update).toHaveBeenCalledTimes(1);
        expect(comment.getComment()).toBe(wantedComment);
        expect(comment.getUpdatedAt()).toEqual(wantedUpdatedAt);
    });

});
