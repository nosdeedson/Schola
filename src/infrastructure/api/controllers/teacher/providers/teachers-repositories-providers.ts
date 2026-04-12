import { Provider } from "@nestjs/common";
import { CLASS_REPOSITORY, SEMESTER_REPOSITORY } from "./teachers.tokens";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";

export const teachersRepositoriesProviders: Provider[] = [
    {
        provide: CLASS_REPOSITORY,
        useClass: ClassRepository
    },
    {
        provide: SEMESTER_REPOSITORY,
        useClass: AcademicSemesterRepository,
    }
]
