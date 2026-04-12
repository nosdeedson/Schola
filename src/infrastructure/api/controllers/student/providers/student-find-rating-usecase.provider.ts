import { FindStudentRantingUsecase } from "@/application/usecases/find-student-rating/find-student-rating-usecase";
import { RatingRepositiry } from "@/infrastructure/repositories/rating/rating.repository";
import { RATING_REPOSITORY } from "../../controller-tokens/controller-tokens";


export const findRatingUsecaseProvider = [
    {
        provide: FindStudentRantingUsecase,
        useFactory: (
            ratingRepo: RatingRepositiry
        ) => {
            return new FindStudentRantingUsecase(
                ratingRepo
            );
        },
        inject: [RATING_REPOSITORY]
    }
]
