import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { DeleteCommentService } from './delete.comment.service';


describe('DeleteCommentService unit tests', () => {

    it('should delete a comment', async () => {
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new DeleteCommentService(commentRepository);
        let wantedId = '05cf6a7c-f7b4-4f39-ac2c-b665cad8e379';
        expect(await service.execute(wantedId)).toBe(void 0);
        expect(commentRepository.delete).toHaveBeenCalledTimes(1);
        expect(commentRepository.delete).toHaveBeenCalledWith(wantedId);
    })

    it('should not throw an error while trying to delete a comment with invalid id', async () => {
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const service = new DeleteCommentService(commentRepository);
        let wantedId = '1234';
        expect(await service.execute(wantedId)).toBe(void 0);
        expect(commentRepository.delete).toHaveBeenCalledTimes(1);
        expect(commentRepository.delete).toHaveBeenCalledWith(wantedId);
    });

});
