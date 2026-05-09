import { CommentRatingUsecase } from "@/application/usecases/comment-rating/comment-rating-usecase";
import { CommentRepository } from "@/infrastructure/repositories/comment/comment.respository";
import { RatingRepository } from "@/infrastructure/repositories/rating/rating.repository";
import { COMMENT_REPOSITORY, RATING_REPOSITORY } from "../../controller-tokens/controller-tokens";


export const commentinRatingUsecaseProvider = [
    {
        provide: CommentRatingUsecase,
        useFactory: (
            ratingRepo: RatingRepository,
            commentRepo: CommentRepository,
        ) => new CommentRatingUsecase(ratingRepo, commentRepo),
        inject: [RATING_REPOSITORY, COMMENT_REPOSITORY]
    }
]
