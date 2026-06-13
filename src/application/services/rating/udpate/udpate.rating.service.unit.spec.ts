import { Grade } from '../../../../domain/enum/grade/grade';
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { UpdateRatingDto } from './udpate.rating.dto';
import { UpdateRatingService } from './update.rating.service';
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks"

describe('update rating service unit tests', () => {

    it('shoud throw a SystemError if rating not found', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.find = jest.fn().mockImplementationOnce(() => { return null });
        const service = new UpdateRatingService(ratingRepository);
        let input = new UpdateRatingDto('123', Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD);
        await expect(service.execute(input)).rejects
            .toMatchObject({ errors: [{ context: 'rating', message: 'Not found' }] });
    });

    it('should update a rating', async () => {
        const rating = mockRating();
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.find = jest.fn().mockImplementationOnce(() => { return rating });
        const service = new UpdateRatingService(ratingRepository);
        let input = new UpdateRatingDto('123', Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD);
        expect(await service.execute(input)).toBe(void 0);
        expect(ratingRepository.find).toHaveBeenCalledTimes(1);
        expect(ratingRepository.update).toHaveBeenCalledTimes(1);
    });

});
