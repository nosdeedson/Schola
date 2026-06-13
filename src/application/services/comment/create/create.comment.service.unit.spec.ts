import { QueryFailedError } from "typeorm";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { CreateCommentDto } from './create.comment.dto';
import { CreateCommentService } from './create.comment.service';

describe('create comment use service unit test', () => {

    it('should create a comment', async () => {
        let rating = mockRating()
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const dto = new CreateCommentDto('test a test', 'name who has done', rating);
        const service = new CreateCommentService(commentRepository);
        expect(await service.execute(dto)).toBe(void 0);
        expect(commentRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error while create a comment', async () => {
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        commentRepository.create = jest.fn()
            .mockImplementation(() => { throw new QueryFailedError(null, null, new Error("failed")) });
        const dto = new CreateCommentDto('test a test', 'name who has done', null);
        const service = new CreateCommentService(commentRepository);
        await expect(service.execute(dto)).rejects.toThrow(QueryFailedError);
    });
});
