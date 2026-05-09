import { SaveRatingUsecase } from "@/application/usecases/save-rating/save-rating-usecase";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { RatingRepository } from "@/infrastructure/repositories/rating/rating.repository";
import { StudentRepository } from "@/infrastructure/repositories/student/student.repository";
import { COMMENT_REPOSITORY, RATING_REPOSITORY, SEMESTER_REPOSITORY, STUDENT_REPOSITORY, WORKER_REPOSITORY } from "../../controller-tokens/controller-tokens";
import { CommentRepository } from "@/infrastructure/repositories/comment/comment.respository";
import { WorkerRepository } from "@/infrastructure/repositories/worker/worker.repository";

export const ratingSaveUsecaseProvider = [
    {
        provide: SaveRatingUsecase,
        useFactory: (
            ratingRepo: RatingRepository,
            semesterRepo: AcademicSemesterRepository,
            studentRepo: StudentRepository,
            commentRepo: CommentRepository,
            workerRepo: WorkerRepository,
        ) => new SaveRatingUsecase(ratingRepo, semesterRepo, studentRepo, commentRepo, workerRepo),
        inject: [RATING_REPOSITORY, SEMESTER_REPOSITORY, STUDENT_REPOSITORY, COMMENT_REPOSITORY, WORKER_REPOSITORY]
    }
]
