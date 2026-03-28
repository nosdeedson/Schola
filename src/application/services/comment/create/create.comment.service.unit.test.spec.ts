import { mockQuarter } from "../../../../../tests/mocks/domain/quarter.mocks";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { MockRepositoriesForUnitTest } from "../../../../infrastructure/__mocks__/mockRepositories";
import { DomainMocks } from '../../../../infrastructure/__mocks__/mocks';
import { RatingEntity } from "../../../../infrastructure/entities/rating/rating.entity";
import { CreateCommentDto } from './create.comment.dto';
import { CreateCommentService } from './create.comment.service';

describe('create comment use service unit test', () =>{

    it('should throw SystemError with Rating not found', async () =>{
        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        
        const dto = new CreateCommentDto('test a test', '0e2189bd-8f47-4665-90b3-53191b52e606', "55c63535-25f8-471e-8184-d1f1d44a042c");

        const service = new CreateCommentService(commentRepository,ratingRepository);
        await expect( service.execute(dto)).rejects.toMatchObject({errors: [{
                "context": "comment",
                "message": "Rating not found",
              }]});
    });

    it('should create a comment', async () =>{

        let rating = mockRating()
        let entity = RatingEntity.toRatingEntity(rating);

        const commentRepository = MockRepositoriesForUnitTest.mockRepositories();
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.find = jest.fn()
            .mockImplementationOnce(() => {
                return entity
            })
        
        const dto = new CreateCommentDto('test a test', '0e2189bd-8f47-4665-90b3-53191b52e606', rating.getId());

        const service = new CreateCommentService(commentRepository,ratingRepository);
        expect(await service.execute(dto)).toBe(void 0);
        expect(commentRepository.create).toHaveBeenCalledTimes(1);
        expect(ratingRepository.find).toHaveBeenCalledTimes(1);

    })

})