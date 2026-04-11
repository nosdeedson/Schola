import { FindRatingByStudent } from "@/application/services/rating/find-rating-by-student/find-rating-by-student.service";
import { RatingRepositoryInterface } from "@/domain/rating/rating.repository.interface";
import { StudentRatingUsecaseDtoOut } from "./find-stdent-rating-usecase-dto-out";

export class FindStudentRantingUsecase {

    constructor(private readonly ratingRepository: RatingRepositoryInterface) { }

    async execute(studentId: string): Promise<any> {
        const service = new FindRatingByStudent(this.ratingRepository);
        const result = await service.findRatingByStudent(studentId);
        return StudentRatingUsecaseDtoOut.toDto(result);
    }

}
