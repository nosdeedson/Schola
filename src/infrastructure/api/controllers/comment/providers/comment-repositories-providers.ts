import { Provider } from "@nestjs/common";
import { COMMENT_REPOSITORY, RATING_REPOSITORY } from "../../controller-tokens/controller-tokens";
import { CommentRepository } from "@/infrastructure/repositories/comment/comment.respository";
import { RatingRepository } from "@/infrastructure/repositories/rating/rating.repository";

export const commentRepositoriesProviders: Provider[] = [
    {
        provide: COMMENT_REPOSITORY,
        useClass: CommentRepository
    },
    {
        provide: RATING_REPOSITORY,
        useClass: RatingRepository
    }
]
