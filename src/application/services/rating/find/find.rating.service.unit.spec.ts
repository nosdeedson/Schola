import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { FindRatingService } from "./find.rating.service";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { RatingMapper } from "@/infrastructure/mappers/rating/rating-mapper";

describe('find rating unit tests', () => {

    it('should throw a systemError', async () => {
        let ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.find = jest.fn().mockImplementationOnce(() => null);
        const service = new FindRatingService(ratingRepository);
        await expect(service.execute('123')).rejects.toMatchObject({
            errors:
                [{ context: 'rating', message: 'Not found' }]
        });
        expect(ratingRepository.find).toHaveBeenCalledTimes(1);
        expect(ratingRepository.find).toHaveBeenCalledWith('123')
    });

    it('should find a rating', async () => {
        let rating = mockRating();
        let ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.find = jest.fn().mockImplementationOnce(() => rating);
        const service = new FindRatingService(ratingRepository);
        const wantedId = rating.getId();
        let result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toBe(rating.getId());
    });

});
