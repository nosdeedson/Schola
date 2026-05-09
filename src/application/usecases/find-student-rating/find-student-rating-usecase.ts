import { FindRatingByStudent } from "@/application/services/rating/find-rating-by-student/find-rating-by-student.service";
import { RatingRepositoryInterface } from "@/domain/rating/rating.repository.interface";
import { StudentRatingUsecaseResponseDto } from "./student-rating-usecase-response-dto";

export class FindStudentRantingUsecase {

    constructor(
        private readonly ratingRepository: RatingRepositoryInterface,
    ) { }

    async execute(studentId: string): Promise<StudentRatingUsecaseResponseDto[]> {
        const service = new FindRatingByStudent(this.ratingRepository);
        const ratings = await service.findRatingByStudent(studentId);
        return StudentRatingUsecaseResponseDto.toDto(ratings);
    }

}
