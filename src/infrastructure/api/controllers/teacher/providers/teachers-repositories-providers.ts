import { Provider } from "@nestjs/common";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { CLASS_REPOSITORY, SEMESTER_REPOSITORY } from "../../controller-tokens/controller-tokens";

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
