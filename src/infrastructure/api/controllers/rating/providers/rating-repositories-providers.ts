import { Provider } from "@nestjs/common";
import { COMMENT_REPOSITORY, RATING_REPOSITORY, SEMESTER_REPOSITORY, STUDENT_REPOSITORY, WORKER_REPOSITORY } from "../../controller-tokens/controller-tokens";
import { RatingRepository } from "@/infrastructure/repositories/rating/rating.repository";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { StudentRepository } from "@/infrastructure/repositories/student/student.repository";
import { CommentRepository } from "@/infrastructure/repositories/comment/comment.respository";
import { WorkerRepository } from "@/infrastructure/repositories/worker/worker.repository";

export const ratingRepositoriesProvider: Provider[] = [
    {
        provide: RATING_REPOSITORY,
        useClass: RatingRepository
    },
    {
        provide: SEMESTER_REPOSITORY,
        useClass: AcademicSemesterRepository,
    },
    {
        provide: STUDENT_REPOSITORY,
        useClass: StudentRepository
    },
    {
        provide: COMMENT_REPOSITORY,
        useClass: CommentRepository
    },
    {
        provide: WORKER_REPOSITORY,
        useClass: WorkerRepository,
    },
]
