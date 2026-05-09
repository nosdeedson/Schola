import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { MockRepositoriesForUnitTest } from "../../../../infrastructure/__mocks__/mockRepositories";
import { RatingEntity } from "../../../../infrastructure/entities/rating/rating.entity";
import { CreateCommentDto } from './create.comment.dto';
import { CreateCommentService } from './create.comment.service';

describe('create comment use service unit test', () => {

    it('should create a comment', async () => {

        let rating = mockRating()
        let entity = RatingEntity.toRatingEntity(rating);

        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const ratingEntity = RatingEntity.toRatingEntity(rating);
        const dto = new CreateCommentDto('test a test', 'name who has done', ratingEntity);

        const service = new CreateCommentService(commentRepository);
        expect(await service.execute(dto)).toBe(void 0);
        expect(commentRepository.create).toHaveBeenCalledTimes(1);

    })

})
