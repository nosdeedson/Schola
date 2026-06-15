import { CommentMapper } from "@/infrastructure/mappers/comment/comment-mapper";
import { Comment } from "../../../domain/comment/comment";
import { Rating } from "@/domain/rating/rating";
import { mockRating } from "../../../../tests/mocks/domain/rating.mocks";


jest.mock('../../../domain/rating/rating')

describe("CommentModel unit tests", () => {

    let comment: Comment;
    let comment1;
    let comments: Comment[] = [];
    let ratingModel: Rating;

    beforeEach(() => {
        ratingModel = mockRating();
        comment = new Comment("comment", 'name who has done');
        comment1 = new Comment("comment1", 'name who has done');
        comments.push(comment)
        comments.push(comment1)
    })

    it('should instantiate a comment from Comment domain', () => {

        const model = CommentMapper.fromDomain(comment, ratingModel);

        expect(model).toBeDefined();
        expect(model.comment).toEqual(comment.getComment());
        expect(model.createdAt).toEqual(comment.getCreatedAt());
        expect(model.deletedAt).toEqual(comment.getDeletedAt());
        expect(model.id).toEqual(comment.getId());
        expect(model.namePersonHaveDone).toEqual(comment.getNamePersonHaveDone());
        expect(model.updatedAt).toEqual(comment.getUpdatedAt());
    });
});
