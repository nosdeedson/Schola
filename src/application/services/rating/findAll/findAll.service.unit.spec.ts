
import { MockRepositoriesForUnitTest } from '../../../../../tests/mocks/mock-repositories/mockRepositories';
import { FindAllRatingService } from './findAll.rating.service';
import { RatingEntity } from '../../../../infrastructure/entities/rating/rating.entity';
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks"
import { RatingMapper } from '@/infrastructure/mappers/rating/rating-mapper';

describe('find all rating unit tests', () =>{

    it('should find an empty array', async () =>{
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.findAll = jest.fn().mockImplementationOnce(() => {return []})
        const service = new FindAllRatingService(ratingRepository);
        let results = await service.execute();
        expect(results.all.length).toBe(0)
    })

    it('should find all rating', async () =>{
        let rating = mockRating();
        let entity = RatingMapper.fromDomain(rating);
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();

        ratingRepository.findAll = jest.fn().mockImplementationOnce(() => {return [entity]})
        const service = new FindAllRatingService(ratingRepository);
        let results = await service.execute();
        expect(results.all.length).toBe(1)
        expect(results.all[0].id).toBe(rating.getId());
    })

})