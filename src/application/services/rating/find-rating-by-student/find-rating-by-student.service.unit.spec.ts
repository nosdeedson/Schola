import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks";
import { MockRepositoriesForUnitTest } from "../../../../../tests/mocks/mock-repositories/mockRepositories";
import { FindRatingByStudent } from "./find-rating-by-student.service";

describe('findRatingByStudent', () => {

    it('should find a rating by student', async () => {
        const rating = mockRating();
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        ratingRepository.findByStudentId = jest.fn()
            .mockImplementation(() => Promise.resolve([rating]));
        const findRatingByStudent = new FindRatingByStudent(ratingRepository);
        const result = await findRatingByStudent.findRatingByStudent('123');
        expect(result).toBeDefined();
        expect(result[0].getId()).toBe(rating.getId());
    });
})
