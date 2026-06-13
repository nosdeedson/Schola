import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { DeleteRatingService } from './delete.rating.service';
import { mockRating } from '../../../../../tests/mocks/domain/rating.mocks';
import { QueryFailedError } from "typeorm";

describe('DeleteRatingService unit tests', () => {

    it('should not thorw an error while trying to deleting a rating', async () => {
        let ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.delete = jest.fn().mockImplementationOnce(() => { return void 0 });
        const service = new DeleteRatingService(ratingRepository);
        expect(await service.execute('123')).toBe(void 0);
        expect(ratingRepository.delete).toHaveBeenCalledTimes(1);
        expect(ratingRepository.delete).toHaveBeenCalledWith('123')

    });

    it('should delete a rating', async () => {
        let rating = mockRating();
        let ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.delete = jest.fn().mockImplementationOnce(() => { return void 0 });
        const service = new DeleteRatingService(ratingRepository);
        expect(await service.execute(rating.getId())).toBe(void 0);
        expect(ratingRepository.delete).toHaveBeenCalledTimes(1);
        expect(ratingRepository.delete).toHaveBeenCalledWith(rating.getId());
    });

    it('should not delete a rating', async () => {
        let ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.delete = jest.fn().mockImplementationOnce(() => { throw new QueryFailedError(null, null, new Error('failed')) });
        const service = new DeleteRatingService(ratingRepository);
        await expect(service.execute('1234')).rejects.toThrow(QueryFailedError)
    });

});
