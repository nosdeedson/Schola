import { StudentCommentRatingUsecase } from "@/application/usecases/student-comment-rating/student-comment-rating-usecase";
import { CommentRepository } from "@/infrastructure/repositories/comment/comment.respository";
import { RatingRepository } from "@/infrastructure/repositories/rating/rating.repository";
import { COMMENT_REPOSITORY, RATING_REPOSITORY } from "../../controller-tokens/controller-tokens";


export const studentCommentRatingUsecaseProvider = [
    {
        provide: StudentCommentRatingUsecase,
        useFactory: (
            ratingRepo: RatingRepository,
            commentRepo: CommentRepository,
        ) => new StudentCommentRatingUsecase(ratingRepo, commentRepo),
        inject: [RATING_REPOSITORY, COMMENT_REPOSITORY]
    }
]