import { StudentCommentRatingUsecaseDto } from "./comment-rating-usecase-dto";

describe('StudentCommentRatingUsecaseDto', () => {
    it('should instantiate a StudentCommentRatingUsecaseDto', () => {
        expect(new StudentCommentRatingUsecaseDto("comment", "Marie", "1234")).toBeDefined();
    })
});
