import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { MockRepositoriesForUnitTest } from "@/infrastructure/__mocks__/mockRepositories";
import { FindRatingByStudent } from "./find-rating-by-student.service";

describe('findRatingByStudent', () => {

    it('should find a rating by student', async () => {
        const rating = mockRating();
        let ratingEntity = RatingEntity.toRatingEntity(rating);
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.findByStudentId = jest.fn()
            .mockImplementation(() => Promise.resolve(ratingEntity));
        const findRatingByStudent = new FindRatingByStudent(ratingRepository);
        const result = await findRatingByStudent.findRatingByStudent('123');
        expect(result).toBeDefined();
        expect(result.id).toBe(ratingEntity.id);
    });
})
