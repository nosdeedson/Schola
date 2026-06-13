import { RatingMapper } from "@/infrastructure/mappers/rating/rating-mapper";
import { mockComment } from "../../../../../tests/mocks/domain/comment.mocks";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { FindCommentService } from './find.comment.service';
import { CommentMapper } from "@/infrastructure/mappers/comment/comment-mapper";

describe('FindCommentService unit tests', () => {

    it('given an non-existent id should return null', async () => {
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        commentRepository.find = jest.fn()
            .mockImplementationOnce(() => {
                return null;
            });
        const service = new FindCommentService(commentRepository);

        const wantedId = '1234';
        await expect(service.execute(wantedId)).rejects.toMatchObject({
            errors:
                [{ context: 'comment', message: 'comment not found' }]
        });
    });

    it('should find a comment', async () => {
        const comment = mockComment();

        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        commentRepository.find = jest.fn().mockImplementationOnce(() => {
            return comment;
        });

        const wantedId = comment.getId();
        const service = new FindCommentService(commentRepository);
        const result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.idComment).toBe(wantedId);
        expect(result.comment).toBe(comment.getComment());
        expect(result.createdAt).toBe(comment.getCreatedAt());
        expect(result.namePersonHadDone).toBe(comment.getNamePersonHaveDone());
        expect(commentRepository.find).toHaveBeenCalledTimes(1);
        expect(commentRepository.find).toHaveBeenCalledWith(wantedId);
    });
});
