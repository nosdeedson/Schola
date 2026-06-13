
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { FindAllRatingService } from './findAll.rating.service';
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks"

describe('find all rating unit tests', () => {

    it('should find an empty array', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.findAll = jest.fn().mockImplementationOnce(() => { return [] })
        const service = new FindAllRatingService(ratingRepository);
        let results = await service.execute();
        expect(results.all.length).toBe(0)
    });

    it('should find all rating', async () => {
        let rating = mockRating();
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();

        ratingRepository.findAll = jest.fn().mockImplementationOnce(() => { return [rating] })
        const service = new FindAllRatingService(ratingRepository);
        let results = await service.execute();
        expect(results.all.length).toBe(1)
        expect(results.all[0].id).toBe(rating.getId());
    });

});
