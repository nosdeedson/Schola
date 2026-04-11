import { StudentRepository } from "@/infrastructure/repositories/student/student.repository";
import { CLASS_REPOSITORY, RATING_REPOSITORY, STUDENT_REPOSITORY } from "./students.tokens";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { ClassProvider, Provider } from "@nestjs/common";
import { RatingRepositiry } from "@/infrastructure/repositories/rating/rating.repository";

export const repositoriesProviders: Provider[] = [
    {
        provide: STUDENT_REPOSITORY,
        useClass: StudentRepository
    },
    {
        provide: CLASS_REPOSITORY,
        useClass: ClassRepository,
    },
    {
        provide: RATING_REPOSITORY,
        useClass: RatingRepositiry,
    }
]
