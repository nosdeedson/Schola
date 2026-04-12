import { StudentRepository } from "@/infrastructure/repositories/student/student.repository";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { Provider } from "@nestjs/common";
import { RatingRepositiry } from "@/infrastructure/repositories/rating/rating.repository";
import { CLASS_REPOSITORY, RATING_REPOSITORY, STUDENT_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const studentsRepositoriesProviders: Provider[] = [
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
