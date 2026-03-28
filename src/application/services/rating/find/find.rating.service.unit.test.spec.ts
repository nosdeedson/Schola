import { MockRepositoriesForUnitTest } from "../../../../infrastructure/__mocks__/mockRepositories";
import { FindRatingService } from "./find.rating.service";
import { RatingEntity} from '../../../../infrastructure/entities/rating/rating.entity';
import { mockRating } from "../../../../../tests/mocks/domains/rating.mocks";

describe('find rating unit tests', () =>{

    it('should throw a systemError', async () =>{
        let ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.find = jest.fn().mockImplementationOnce(() => null);
        const service = new FindRatingService(ratingRepository);
        await expect(service.execute('123')).rejects.toMatchObject({errors: 
            [{context: 'rating', message: 'Not found'}]
        });
        expect(ratingRepository.find).toHaveBeenCalledTimes(1);
        expect(ratingRepository.find).toHaveBeenCalledWith('123')
    });

    it('should find a rating', async () => { 
        let rating = mockRating();   
        let entity = RatingEntity.toRatingEntity(rating);     
        let ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.find = jest.fn().mockImplementationOnce(() => entity);
        const service = new FindRatingService(ratingRepository);
        const wantedId = rating.getId();
        let result = await service.execute(wantedId);
        expect(result).toBeDefined();
        expect(result.id).toBe(rating.getId());
    });

})