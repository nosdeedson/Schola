import { mockRating } from "../../../../../tests/mocks/domain/rating.mocks"
import { FindRatingDto } from "./find.rating.dto";
import { mockComment } from "../../../../../tests/mocks/domain/comment.mocks";

describe('FindRatingDto', () => {
    it('should instantiate a FindRatingDto', () => {
        const rating = mockRating();
        const dto = new FindRatingDto(rating);
        expect(dto).toBeDefined();
    });

    it('should instantiate a FindRatingDto', () => {
        const rating = mockRating();
        const comment = mockComment();
        rating.setComments(comment);
        const dto = new FindRatingDto(rating);
        expect(dto).toBeDefined();
        expect(dto.comments).toEqual([comment.getComment()])
    });
});
