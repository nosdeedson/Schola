import { FindStudentRantingUsecase } from "./find-student-rating-usecase";
import { FindRatingByStudent } from "@/application/services/rating/find-rating-by-student/find-rating-by-student.service";
import { mockRating } from "../../../../tests/mocks/domain/rating.mocks";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";
import { MockRepositoriesForUnitTest } from "../../../../tests/mocks/mock-repositories/mockRepositories";

describe('studentRatingUsecase', () => {

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it("should find a ranting of a student", async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const id = "22ac66ab-fae4-4666-82b9-cf0c774f54ed";
        const rating = mockRating();
        const studentRatingUsecase = jest.spyOn(FindRatingByStudent.prototype, 'findRatingByStudent')
            .mockResolvedValue([rating]);
        const usecase = new FindStudentRantingUsecase(ratingRepository);
        const result = await usecase.execute(id);
        expect(result).toHaveLength(1)
        expect(result).toBeDefined();
        expect(studentRatingUsecase).toHaveBeenCalledTimes(1);
        expect(studentRatingUsecase).toHaveBeenCalledWith(id);
    });

    it('should find an empty array', async () => {
        const ratingRepository = MockRepositoriesForUnitTest.mockRepositories();
        const id = 'a4b5d267-9f5e-4878-b2f2-f5d84746fc6e';
        const studentRatingUsecase = jest.spyOn(FindRatingByStudent.prototype, 'findRatingByStudent')
            .mockResolvedValue([]);
        const usecase = new FindStudentRantingUsecase(ratingRepository);
        const result = await usecase.execute(id);
        expect(studentRatingUsecase).toHaveBeenCalledTimes(1);
        expect(studentRatingUsecase).toHaveBeenCalledWith(id);
        expect(result).toHaveLength(0);
    });
});
