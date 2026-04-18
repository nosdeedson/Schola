import { FindAllSemesterUsecase } from "@/application/usecases/semester-usecases/find-all/find-all-semester-usecase";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { SEMESTER_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const semesterFindAllUsecaseProvider = [
    {
        provide: FindAllSemesterUsecase,
        useFactory: (semesterRepo: AcademicSemesterRepository) => new FindAllSemesterUsecase(semesterRepo),
        inject: [SEMESTER_REPOSITORY]
    }
]
