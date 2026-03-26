import { MockRepositoriesForUnitTest } from "../../../../infrastructure/__mocks__/mockRepositories";
import { DomainMocks } from "../../../../infrastructure/__mocks__/mocks";
import { DeleteRatingService } from './delete.rating.service';
import {mockRating} from '../../../../../tests/mocks/domains/rating.mocks';

describe('DeleteRatingService unit tests', () =>{

    it('should not thorw an error while trying to deleting a rating', async () => {
        let rating = mockRating();
        
        let ratingRepository = MockRepositoriesForUnitTest.mockRepositories();

        ratingRepository.delete = jest.fn().mockImplementationOnce(() => { return void 0});

        const service = new DeleteRatingService(ratingRepository);
        expect(await service.execute('123')).toBe(void 0);
        expect(ratingRepository.delete).toHaveBeenCalledTimes(1);
        expect(ratingRepository.delete).toHaveBeenCalledWith('123')

    });

    it('should delete a rating', async () => {
        let rating = mockRating();
        
        let ratingRepository = MockRepositoriesForUnitTest.mockRepositories();

        ratingRepository.delete = jest.fn().mockImplementationOnce(() => { return void 0});

        const service = new DeleteRatingService(ratingRepository);
        expect(await service.execute(rating.getId())).toBe(void 0);
        expect(ratingRepository.delete).toHaveBeenCalledTimes(1);
        expect(ratingRepository.delete).toHaveBeenCalledWith(rating.getId());

    });

})