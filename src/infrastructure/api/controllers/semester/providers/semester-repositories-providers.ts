import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { Provider } from "@nestjs/common";
import { SEMESTER_REPOSITORY } from "../../controller-tokens/controller-tokens";


export const semesterRepositoriesProviders: Provider[] = [
    {
        provide: SEMESTER_REPOSITORY,
        useClass: AcademicSemesterRepository
    }
]
