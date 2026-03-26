import { Grade } from '../../../../domain/enum/grade/grade';
import { MockRepositoriesForUnitTest } from "../../../../infrastructure/__mocks__/mockRepositories";
import { RatingEntity } from '../../../../infrastructure/entities/rating/rating.entity';
import { UpdateRatingDto } from './udpate.rating.dto';
import { UpdateRatingService } from './update.rating.service';
import { mockRating } from "../../../../../tests/mocks/domains/rating.mocks"

describe('update rating service unit tests', () => {

    it('shoud throw a SystemError if rating not found', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.find = jest.fn().mockImplementationOnce(() => { return null });
        const service = new UpdateRatingService(ratingRepository);
        let input = new UpdateRatingDto('123', Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD);
        try {
            await service.execute(input)
        } catch (error) {
            expect(error).toBeDefined();
            //@ts-ignore
            expect(error.errors).toMatchObject([{ context: 'rating', message: 'Not found' }]);
            expect(ratingRepository.find).toHaveBeenCalledTimes(1);
            expect(ratingRepository.update).toHaveBeenCalledTimes(0);
        }
    });

    it('should update a rating', async () => {
        const rating = mockRating();
        const entity = RatingEntity.toRatingEntity(rating);
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.find = jest.fn().mockImplementationOnce(() => { return entity });
        const service = new UpdateRatingService(ratingRepository);
        let input = new UpdateRatingDto('123', Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD, Grade.GOOD);
        expect(await service.execute(input)).toBe(void 0);
        expect(ratingRepository.find).toHaveBeenCalledTimes(1);
        expect(ratingRepository.update).toHaveBeenCalledTimes(1);
        expect(ratingRepository.update).toHaveBeenCalledWith(entity)
    });

});