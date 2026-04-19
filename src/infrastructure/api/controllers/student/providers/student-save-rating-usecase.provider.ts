import { SaveRatingUsecase } from "@/application/usecases/save-rating/save-rating-usecase";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { RatingRepositiry } from "@/infrastructure/repositories/rating/rating.repository";
import { StudentRepository } from "@/infrastructure/repositories/student/student.repository";
import { RATING_REPOSITORY, SEMESTER_REPOSITORY, STUDENT_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const studentSaveRatingUsecaseProvider = [
    {
        provide: SaveRatingUsecase,
        useFactory: (
            ratingRepo: RatingRepositiry,
            semesterRepo: AcademicSemesterRepository,
            studentRepo: StudentRepository
        ) => new SaveRatingUsecase(ratingRepo, semesterRepo, studentRepo),
        inject: [SEMESTER_REPOSITORY, RATING_REPOSITORY, STUDENT_REPOSITORY]
    }
]
